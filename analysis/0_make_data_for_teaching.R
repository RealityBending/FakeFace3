library(tidyverse)

df <- read.csv("../data/rawdata_participants.csv")
dftask <- read.csv("../data/rawdata_task.csv")

# Questionnaires scores
df$BAIT <- df |>
  select(starts_with("BAIT_"), -BAIT_AttentionCheck, -BAIT_AI_Use, -BAIT_AI_Knowledge) |>
  # Reverse
  mutate(
    BAIT_2_ImagesIssues = 6 - BAIT_2_ImagesIssues,
    BAIT_3_VideosIssues = 6 - BAIT_3_VideosIssues,
    BAIT_8_TextIssues = 6 - BAIT_8_TextIssues,
    BAIT_13_ArtIssues = 6 - BAIT_13_ArtIssues,
    BAIT_9_Dangerous = 6 - BAIT_9_Dangerous,
    BAIT_10_Worry = 6 - BAIT_10_Worry
  ) |>
  rowMeans(na.rm = TRUE)

df <- df |>
  select(Participant, starts_with("MIST_")) |>
  pivot_longer(-Participant, names_to = "Item", values_to = "Response") |>
  separate(Item, into = c("MIST", "nature", "type", "item"), sep = "_") |>
  # filter(nature == "fake") |>
  summarize(MIST = sum(Response <= 0, na.rm = TRUE) / n(), .by = "Participant") |>
  left_join(df, by = join_by("Participant"))

# Only select the first 10 items which are pseudo-profound bullshit
df$BRS <- rowMeans(df[, paste0("BRS_", 1:10)])
df$BRS_Control <- rowMeans(df[, paste0("BRS_", 11:20)])
df$BRS_Sensitivity <- df$BRS - df$BRS_Control


# Attention checks
df$AttentionChecks <- data.frame(x1 = ifelse(df$BAIT_AttentionCheck == 6, 1, 0), x2 = ifelse(df$BRS_Attention == 1, 1, 0)) |>
  rowMeans(na.rm = TRUE)

# Filter
df <- filter(df, !is.na(Age) & Age >= 18)

# Task
df <- dftask |>
  mutate(Attractiveness = datawizard::rescale(Attractiveness, to = c(0, 1), range = c(-100, 100))) |>
  summarize(
    # Task_p_Real = sum(Reality >= 0) / n(),
    # Task_Confidence = mean(abs(Reality) / 100),
    # Task_FakeAttractiveness = mean(ifelse(Condition == "AI-Generated", Attractiveness, NA), na.rm = TRUE),
    AttractivenessBias = mean(ifelse(Condition == "Photograph", Attractiveness, NA), na.rm = TRUE) - mean(ifelse(Condition == "AI-Generated", Attractiveness, NA), na.rm = TRUE),
    .by = "Participant"
  ) |>
  left_join(df, by = join_by("Participant"))

# hist(df$AttentionChecks)
#
parameters::parameters(lm(AttractivenessBias ~ MIST + BRS, data = df))
parameters::parameters(lm(AttractivenessBias ~ BAIT + BRS, data = df))
#
# parameters::parameters(lm(AttractivenessBias ~ MIST + BAIT, data = df))
# parameters::parameters(lm(AttractivenessBias ~ BRS + BAIT, data = df))
# parameters::parameters(lm(AttractivenessBias ~ BRS + MIST + BAIT, data = df))
#
#
# plot(correlation::cor_test(df, "AttractivenessBias", "MIST"))
# plot(correlation::cor_test(df, "AttractivenessBias", "BAIT"))
#
# parameters::parameters(lm(AttractivenessBias ~ BRS + BAIT, data = filter(df, Gender == "Man")))
# parameters::parameters(lm(AttractivenessBias ~ MIST_p_True + BAIT, data = filter(df, Gender == "Man")))
# parameters::parameters(lm(AttractivenessBias ~ BRS + BAIT, data = filter(df, Gender == "Woman")))
# parameters::parameters(lm(AttractivenessBias ~ MIST_p_True + BAIT, data = filter(df, Gender == "Woman")))


# Scramble demographics
df$Gender <- sample(df$Gender)
df$SexualOrientation <- sample(df$SexualOrientation)
df$Ethnicity <- sample(df$Ethnicity)
df$Age <- sample(df$Age)

# Save
data <- df |>
  select(Participant, Age, Gender, AttractivenessBias, BAIT, MIST, BRS, AttentionChecks) |>
  arrange(Participant)

summary(data)
write.csv(data, "../data/DiscoveringStats2025.csv", row.names = FALSE)


# data |>
#   select(-AttentionChecks) |>
#   correlation::correlation(p_adjust = "none") |>
#   summary()
