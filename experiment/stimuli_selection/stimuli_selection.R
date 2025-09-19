library(tidyverse)

# Path to the neutral images
path_london <- "C:/Users/asf25/Box/Databases/Faces/London/"
path_london <- "C:/Users/domma/Box/Databases/Faces/London/"

# Attractiveness ratings (on a 1-7 scale from "much less attractiveness than average" to "much more attractive than average") for the neutral front faces from 2513 people (ages 17-90) are included in the file london_faces_ratings.csv
df <- read.csv(paste0(path_london, "london_faces_ratings.csv"))
info <- read.csv(paste0(path_london, "london_faces_info.csv")) |>
  select(Stimulus = face_id, face_sex)

library(tidyverse)

# Load data
df <- read.csv(
  "C:/Users/domma/Box/Databases/Faces/London/london_faces_ratings.csv"
)
info <- read.csv(
  "C:/Users/domma/Box/Databases/Faces/London/london_faces_info.csv"
) |>
  select(Stimulus = face_id, face_sex)

# Summarise per rater group
dat <- df |>
  pivot_longer(
    cols = starts_with("X"),
    names_to = "Stimulus",
    values_to = "Attractiveness"
  ) |>
  summarise(
    Mean = mean(Attractiveness, na.rm = TRUE),
    SD   = sd(Attractiveness, na.rm = TRUE),
    N    = n(),
    .by  = c("rater_sex", "rater_sexpref", "Stimulus")
  ) |>
  filter(rater_sex != "" & !rater_sexpref %in% c("", "either", "neither")) |>
  filter(
    (rater_sex == "female" & rater_sexpref == "men") |
      (rater_sex == "male" & rater_sexpref == "women")
  ) |>
  full_join(info, by = "Stimulus")

# Function to select lowest/highest/mean faces for a group
select_group <- function(df, rater, face) {
  pool <- df |>
    filter(rater_sex == rater, face_sex == face) |>
    mutate(
      rank_low  = rank(Mean, ties.method = "first"),
      rank_high = rank(-Mean, ties.method = "first"),
      dist_med  = abs(Mean - mean(Mean, na.rm = TRUE)),
      rank_med  = rank(dist_med, ties.method = "first")
    )

  pool |>
    filter(rank_low <= 3 | rank_high <= 3 | rank_med <= 3) |>
    arrange(Mean) |>
    distinct(Stimulus, .keep_all = TRUE)
}

# Iterative selection
remaining <- dat
all_selection <- list()

# 1. male faces by women
sel1 <- select_group(remaining, rater = "female", face = "male")
remaining <- anti_join(remaining, sel1, by = "Stimulus")
all_selection[["female_raters_male_faces"]] <- sel1

# 2. female faces by men
sel2 <- select_group(remaining, rater = "male", face = "female")
remaining <- anti_join(remaining, sel2, by = "Stimulus")
all_selection[["male_raters_female_faces"]] <- sel2

# 3. female faces by women
sel3 <- select_group(remaining, rater = "female", face = "female")
remaining <- anti_join(remaining, sel3, by = "Stimulus")
all_selection[["female_raters_female_faces"]] <- sel3

# 4. male faces by men
sel4 <- select_group(remaining, rater = "male", face = "male")
remaining <- anti_join(remaining, sel4, by = "Stimulus")
all_selection[["male_raters_male_faces"]] <- sel4

# Combine all
selection <- bind_rows(all_selection, .id = "group")

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


# Remove all current files
unlink("../stimuli/*")
#
# Copy each file
for (id in selection$Item) {
  file.copy(paste0(paste0(path_london, "neutral_front/"), id), "../stimuli/")
}

#===============================================================================
# Create instruction image


library(magick)

# get two female faces NOT in the final selection
excluded_female <- dat |>
  filter(face_sex == "female", !Stimulus %in% selection$Stimulus) |>
  slice_head(n = 3) |>
  slice_tail(n = 2)  # just take the first two

files <- paste0(path_london, "neutral_front/",
                str_remove(excluded_female$Stimulus, "^X"), "_03.jpg")

# read them
img1 <- image_read(files[1])
img2 <- image_read(files[2])

# add watermarks
img1 <- image_annotate(
  img1,
  text   = "London Lab Database (Debruine, 2024)",
  size   = 70,
  color  = "white",
  boxcolor = "black",   # background for readability
  gravity = "southeast"     # place at bottom
)

img2 <- image_annotate(
  img2,
  text   = "Style-transferred output (E-EGAN V0.54)",
  size   = 70,
  color  = "white",
  boxcolor = "black",
  gravity = "southeast"
)

# create an arrow image
arrow <- image_blank(width = 200, height = max(image_info(img1)$height,
                                               image_info(img2)$height),
                     color = "white") |>
  image_annotate("→", size = 100, color = "black", gravity = "center")

# combine side by side
final_img <- image_append(c(img1, arrow, img2), stack = FALSE) |>
  image_resize("800")

# preview
print(final_img)

# save to file
image_write(final_img, "../media/example.png")
