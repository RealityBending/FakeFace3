library(tidyverse)
library(easystats)
library(tidymodels)
library(themis)  # For step_smote

# TODO: add a group of randomly generated participants (random data) to show that this group should be classified with low probability in any of the groups (they are a true "new" group)

df <- read.csv("https://raw.githubusercontent.com/RealityBending/FakeFace2/refs/heads/main/data/rawdata_task.csv") |>
  select(Participant, Stimulus, Attractiveness) |>
  full_join(
    read.csv("https://raw.githubusercontent.com/RealityBending/FakeFace2/refs/heads/main/data/rawdata_participants.csv") |>
      mutate(Category = paste(Gender, SexualOrientation, sep = " - ")) |>
      select(Participant, Category), by = "Participant")

summarize(df, n = n_distinct(Participant), .by = Category)

dfwide <- pivot_wider(df, names_from = Stimulus, values_from = Attractiveness)

# --- Data split ---
features <- filter(dfwide, Category %in% c("Female - Heterosexual",  "Male - Heterosexual"))

data_split <- initial_split(features, strata = Category)
train_data <- training(data_split)
test_data  <- testing(data_split)
new_data <- filter(dfwide, !Category %in% c("Female - Heterosexual",  "Male - Heterosexual"))

# --- Cross-validation folds ---
folds <- vfold_cv(train_data, v = 10, strata = Category)

# --- Preprocessing recipe ---
rec <- recipe(Category ~ ., data = train_data) |>
  update_role(Participant, new_role = "ID") |>
  step_normalize(all_predictors()) |>
  step_smote(Category)   # balance F vs M

# --- Model specifications ---

# Random Forest
rf_spec <- rand_forest(mtry = tune(), min_n = tune(), trees = 1000) |>
  set_engine("ranger", importance = "impurity") |>
  set_mode("classification")

# XGBoost
xgb_spec <- boost_tree(
  trees = 1000,
  tree_depth = tune(),
  learn_rate = tune(),
  loss_reduction = tune(),
  min_n = tune(),
  sample_size = tune(),
  mtry = tune()
) |>
  set_engine("xgboost") |>
  set_mode("classification")

# --- Workflows ---
rf_wf  <- workflow() |> add_recipe(rec) |> add_model(rf_spec)
xgb_wf <- workflow() |> add_recipe(rec) |> add_model(xgb_spec)

# --- Grids ---
rf_grid <- grid_regular(mtry(range = c(5, 30)), min_n(), levels = 5)

xgb_grid <- grid_space_filling(
  tree_depth(),
  learn_rate(),
  loss_reduction(),
  min_n(),
  sample_size = sample_prop(),
  mtry(range = c(5, 30)),
  size = 20
)

# --- Metrics ---
my_metrics <- metric_set(accuracy, bal_accuracy, kap, f_meas, roc_auc)

# --- Tune ---
rf_res <- tune_grid(rf_wf, resamples = folds, grid = rf_grid, metrics = my_metrics)
xgb_res <- tune_grid(xgb_wf, resamples = folds, grid = xgb_grid, metrics = my_metrics)

# --- Select best by balanced accuracy ---
rf_best  <- select_best(rf_res, metric = "bal_accuracy")
xgb_best <- select_best(xgb_res, metric = "bal_accuracy")

rf_final  <- finalize_workflow(rf_wf, rf_best)
xgb_final <- finalize_workflow(xgb_wf, xgb_best)

rf_summary  <- show_best(rf_res, metric = "bal_accuracy", n = 1)
xgb_summary <- show_best(xgb_res, metric = "bal_accuracy", n = 1)

all_results <- bind_rows(
  rf_summary |> mutate(model = "Random Forest"),
  xgb_summary |> mutate(model = "XGBoost")
)

print(all_results)

# --- Pick best ---
best_model <- slice_max(all_results, mean)$model

cat("Best model:", best_model, "\n")

# --- Final fit on full train + test evaluation ---
if (best_model == "Random Forest") {
  final_fit <- last_fit(rf_final, split = data_split, metrics = my_metrics)
} else {
  final_fit <- last_fit(xgb_final, split = data_split, metrics = my_metrics)
}


# Results from best model -------------------------------------------------


collect_metrics(final_fit)

conf_mat_res <- collect_predictions(final_fit) |>
  conf_mat(truth = Category, estimate = .pred_class)

conf_mat_res



# Predictions -------------------------------------------------------------

# --- Extract fitted workflow from last_fit ---
final_workflow <- extract_workflow(final_fit)

# --- Predictions for test set ---
pred_test <- predict(final_workflow, test_data, type = "prob") %>%
  bind_cols(test_data %>% select(Participant, Category)) %>%
  mutate(set = "test")

# --- Predictions for new data ---
pred_new <- predict(final_workflow, new_data, type = "prob") %>%
  bind_cols(new_data %>% select(Participant, Category)) %>%
  mutate(set = "new")

# --- Combine predictions ---
pred_all <- bind_rows(pred_test, pred_new)




pred_all |>
  mutate(
    Prediction = ifelse(`.pred_Female - Heterosexual` > `.pred_Male - Heterosexual`,
                        "Female - Heterosexual", "Male - Heterosexual"),
    point_x = ifelse(Prediction == "Female - Heterosexual", `.pred_Female - Heterosexual` * 100,
                     -`.pred_Male - Heterosexual` * 100)
  ) |>
  arrange(Category, `.pred_Female - Heterosexual`) |>
  # Combine categories into one factor so groups stay together
  mutate(Participant = fct_inorder(Participant)) |>
  ggplot(aes(y = Participant)) +
  # Female probability (positive direction)
  geom_segment(
    aes(x = 0, xend = `.pred_Female - Heterosexual` * 100,
        yend = Participant, color = Category),
    linewidth = 0.1
  ) +
  # Male probability (negative direction)
  geom_segment(
    aes(x = -`.pred_Male - Heterosexual` * 100, xend = 0,
        yend = Participant, color = Category),
    linewidth = 0.1
  ) +
  # Point at end of predicted side
  geom_point(aes(x = point_x, y = Participant, fill = Prediction),
             shape = 21, color = "black", size = 3) +
  geom_vline(xintercept = 0, linetype = "dashed") +
  scale_x_continuous(
    name = "Probability (-100% = Male Het, +100% = Female Het)",
    limits = c(-100, 100)
  ) +
  labs(y = "Participant") +
  theme_minimal() +
  facet_wrap(~set, ncol = 1, scales = "free_y")
