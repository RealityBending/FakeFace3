library(tidyverse)

# Attractiveness ratings (on a 1-7 scale from "much less attractiveness than average" to "much more attractive than average") for the neutral front faces from 2513 people (ages 17-90) are included in the file london_faces_ratings.csv
df <- read.csv(
  "C:/Users/domma/Box/Databases/Faces/London/london_faces_ratings.csv"
)
info <- read.csv(
  "C:/Users/domma/Box/Databases/Faces/London/london_faces_info.csv"
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
    rank_low <= 2 | # 2 lowest
      rank_high <= 2 | # 2 highest
      rank_med <= 2 # 2 closest to median
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
