library(tidyverse)

# Attractiveness ratings (on a 1-7 scale from "much less attractiveness than average" to "much more attractive than average") for the neutral front faces from 2513 people (ages 17-90) are included in the file london_faces_ratings.csv
df <- read.csv(
  # "C:/Users/domma/Box/Databases/Faces/London/london_faces_ratings.csv"
  "C:/Users/asf25/Box/Databases/Faces/London/london_faces_ratings.csv"

)
info <- read.csv(
  # "C:/Users/domma/Box/Databases/Faces/London/london_faces_info.csv"
  "C:/Users/asf25/Box/Databases/Faces/London/london_faces_info.csv"
) |>
  select(Stimulus = face_id, face_sex)

dat <- df |>
  pivot_longer(
    cols = starts_with("X"),
    names_to = "Stimulus",
    values_to = "Attractiveness"
  ) |>
  summarise(
    Mean = mean(Attractiveness, na.rm = TRUE),
    SD = sd(Attractiveness, na.rm = TRUE),
    N = n(),
    .by = c("rater_sex", "rater_sexpref", "Stimulus")
  ) |>
  filter(rater_sex != "" & !rater_sexpref %in% c("", "either", "neither")) |>
  filter(
    (rater_sex == "female" & rater_sexpref == "men") |
      (rater_sex == "male" & rater_sexpref == "women")
  ) |>
  full_join(info, by = c("Stimulus"))


selection <- dat |>
  mutate(
    rank_low = rank(Mean, ties.method = "first"),
    rank_high = rank(-Mean, ties.method = "first"),
    dist_med = abs(Mean - median(Mean, na.rm = TRUE)),
    rank_med = rank(dist_med, ties.method = "first"),
    .by = c("rater_sex", "face_sex")
  ) |>
  filter(
    rank_low <= 3| # 3 lowest
      rank_high <= 3 | # 3 highest
      rank_med <= 3 # 3 closest to median
  ) |>
  arrange(rater_sex, face_sex, Mean)

selection

dat |>
  mutate(Selected = ifelse(Stimulus %in% selection$Stimulus, "yes", "no")) |>
  ggplot(aes(x = Mean, y = SD, color = face_sex)) +
  geom_point(aes(shape = Selected)) +
  geom_text(data = selection, aes(label = Stimulus), vjust = -1) +
  facet_wrap(~rater_sex) +
  scale_shape_manual(values = c(3, 16))

#===============================================================================

# Remove "X" prefix from Stimulus IDs
selection <- selection |>
  mutate(Item = paste0(str_remove(Stimulus, "^X"), "_03.jpg"))


# Save selection and its characteristics
write.csv(selection, "stimuli_data.csv", row.names = FALSE)

json <- selection |> 
  select(Item, rater_sex, rater_sexpref, face_sex) |> 
  jsonlite::toJSON()

write(paste("var stimuli_list = ", json), "stimuli_list.js")

# Path to the neutral images
path_london <- "C:/Users/asf25/Box/Databases/Faces/London/neutral_front/"

# Remove all current files
unlink("../stimuli/*")
# 
# Copy each file
for (id in selection$Item) {
  file.copy(paste0(path_london, id), "../stimuli/")
}

