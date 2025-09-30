library(jsonlite)
# library(progress)

# path for data
path <- "C:/Users/asf25/Box/FakeFace3/"

# JsPsych Experiment ----------------------------

files <- list.files(path, pattern = "*.csv")

# Progress bar
# progbar <- progress_bar$new(total = length(files))


alldata <-  data.frame()
alldata_task <-  data.frame()

for (file in files){
  # file <- "4ljjkg37z7.csv"
  # progbar$tick()
  rawdata <- read.csv(paste0(path, "/", file))
  message(paste("\nProcessing:", file))
  
  # PARTCIPANT DATA ====================================================================================
  
  # Initialize participant-level data
  dat <- rawdata[rawdata$screen == "browser_info", ]
  
  participant <- gsub(".csv", "", rev(strsplit(file, "/")[[1]])[1]) # Filename without extension
  
  data_ppt <- data.frame(
    Participant = participant,
    Experiment_StartDate = as.POSIXct(paste(dat$date, dat$time), format = "%d/%m/%Y %H:%M:%S"),
    Experiment_Duration = rawdata[rawdata$screen == "demographics_debrief", "time_elapsed"] / 1000 / 60,
    Browser_Version = paste(dat$browser, dat$browser_version),
    Mobile = dat$mobile,
    Platform = dat$os,
    Screen_Width = dat$screen_width,
    Screen_Height = dat$screen_height
  )
  
  demog <- jsonlite::fromJSON(rawdata[rawdata$screen == "demographic_questions", ]$response)
  
  # Gender
  demog$Gender <- ifelse(demog$Gender == "other", demog$`Gender-Comment`, demog$Gender)
  demog$`Gender-Comment` <- NULL
  
  # Ethnicity
  demog$Ethnicity <- ifelse(!is.null(demog$Ethnicity), demog$Ethnicity, NA)
  demog$Ethnicity <- ifelse(demog$Ethnicity == "other", demog$`Ethnicity-Comment`, demog$Ethnicity)
  demog$`Ethnicity-Comment` <- NULL
  
  #Sexual orientation
  demog$SexualOrientation <- ifelse(!is.null(demog$SexualOrientation), demog$SexualOrientation, NA)
  demog$SexualOrientation <- ifelse(demog$SexualOrientation == "other", demog$`SexualOrientation-Comment`, demog$SexualOrientation)
  demog$`SexualOrientation-Comment` <- NULL
  
  demog <- as.data.frame(demog)
  data_ppt <- cbind(data_ppt, demog)
  
  # Fiction Feedback
  fb <- jsonlite::fromJSON(rawdata[rawdata$screen == "fiction_feedback1","response"])
  data_ppt$Feedback_BigDifferenceRealAI <- FALSE
  data_ppt$Feedback_SmallDifferenceRealAI <- FALSE
  data_ppt$Feedback_NoDifferenceRealAI <- FALSE
  data_ppt$Feedback_LabelsNotCorrect <- FALSE
  data_ppt$Feedback_LabelsReversed <- FALSE
  data_ppt$Feedback_LabelsAllPhotos <- FALSE
  data_ppt$Feedback_LabelsAllAI <- FALSE
  data_ppt$Feedback_ConfidenceReal <- NA
  data_ppt$Feedback_ConfidenceFake<- NA
  
  if ("Feedback_2" %in% names(fb)) {
    if (any(grepl("was obvious", fb$Feedback_2))) {
      data_ppt$Feedback_BigDifferenceRealAI <- TRUE
    }
    if (any(grepl("was subtle", fb$Feedback_2))) {
      data_ppt$Feedback_SmallDifferenceRealAI <- TRUE
    }
    if (any(grepl("any difference", fb$Feedback_2))) {
      data_ppt$Feedback_NoDifferenceRealAI <- TRUE
    }
    if (any(grepl("not always correct", fb$Feedback_2))) {
      data_ppt$Feedback_LabelsNotCorrect <- TRUE
    }
    if (any(grepl("labels were reversed", fb$Feedback_2))) {
      data_ppt$Feedback_LabelsReversed <- TRUE
    }
    if (any(grepl("images were photos", fb$Feedback_2))) {
      data_ppt$Feedback_LabelsAllPhotos <- TRUE
    }
    if (any(grepl("images were AI-generated", fb$Feedback_2))) {
      data_ppt$Feedback_LabelsAllAI <- TRUE
    }
  }
  if (!is.null(fb$Feedback_2_ConfidenceReal)) {
    data_ppt$Feedback_ConfidenceReal <- fb$Feedback_2_ConfidenceReal
  }
  if (!is.null(fb$Feedback_2_ConfidenceFake)) {
    data_ppt$Feedback_ConfidenceFake <- fb$Feedback_2_ConfidenceFake
  }
  
  
  # Experiment Feedback
  fb_exp <- jsonlite::fromJSON(rawdata[rawdata$screen == "experiment_feedback", "response"])
  data_ppt$Experiment_Enjoyment <- ifelse(is.null(fb_exp$Feedback_Enjoyment), NA, fb_exp$Feedback_Enjoyment)
  data_ppt$Experiment_Quality <- ifelse(is.null(fb_exp$Feedback_Quality), NA, fb_exp$Feedback_Quality)
  data_ppt$Experiment_Unusual <- ifelse(is.null(fb_exp$Feedback_Unusual), NA, fb_exp$Feedback_Unusual)
  data_ppt$Experiment_PerceptionChange <- ifelse(is.null(fb_exp$Feedback_Unusual), NA, fb_exp$Feedback_Unusual)
  data_ppt$Experiment_Feedback <- ifelse(is.null(fb_exp$Feedback_Text), NA, fb_exp$Feedback_Text)
  
  
  # Questionnaires ==========================================================================
  bait <- as.data.frame(jsonlite::fromJSON(rawdata[
    rawdata$screen == "questionnaire_bait",
    "response"
  ]))
  data_ppt <- cbind(data_ppt, bait)
  if(!"BAIT_AI_Use" %in% names(bait)) {
    data_ppt$BAIT_AI_Use <- NA
  }
  
  mist <-jsonlite::fromJSON(rawdata[rawdata$screen == "questionnaire_MIST","response"])
  mist <- mist[!sapply(mist, is.null)]
  data_ppt <- cbind(data_ppt, mist)

  BRS <- jsonlite::fromJSON(rawdata[rawdata$screen == "questionnaire_BRS","response"])
  BRS <- BRS[!sapply(BRS, is.null)]
  data_ppt <- cbind(data_ppt, BRS)
  
  # Task=====================================================================================
  
  # phase 1
  cue1 <- rawdata[rawdata$screen == "fiction_cue", ]
  img1 <- rawdata[rawdata$screen == "fiction_image1", ]
  resp1 <- lapply(
    rawdata[rawdata$screen == "fiction_ratings1", "response"],
    \(x) {
      y <- jsonlite::fromJSON(x, simplifyVector = TRUE)
      y <- as.list(y)
      
      # Keep only the 4 columns you care about
      fields <- c("Attractiveness", "Beauty", "Symmetry", "AttentionCheck")
      
      # Fill missing ones with NA
      for (nm in fields) {
        if (!nm %in% names(y) || length(y[[nm]]) == 0) {
          y[[nm]] <- NA
        }
      }
      
      # Return as one-row data frame
      as.data.frame(y[fields], stringsAsFactors = FALSE)
    }
  )
  resp1 <- do.call(rbind, resp1)
  
  img2 <- rawdata[rawdata$screen == "fiction_image2", ]
  resp2 <- sapply(
    rawdata[rawdata$screen == "fiction_ratings2", "response"],
    \(x) {
      dat <- jsonlite::fromJSON(x)
      dat$Instructions <- NULL
      as.data.frame(dat)
    },
    simplify = FALSE,
    USE.NAMES = FALSE
  )
  resp2 <- do.call(rbind, resp2)
  
  # Make sure no skipping occured
  if (!all(img1$response == "null")) {
    print("Responses not all null!")
    break
  }

  data_task <- data.frame(
    Participant = participant,
    Condition = cue1$condition,
    Item = img1$item,
    Trial1 = img1$trial_number,
    CueColor = tools::toTitleCase(cue1$color),
    ScreenWidth = img1$window_width,
    ScreenHeight = img1$window_height,
    Attractiveness  = resp1$Attractiveness ,
    Beauty  = resp1$Beauty ,
    Symmetry = resp1$Symmetry
  ) |>
    merge(
      data.frame(
        Item = img2$item,
        Trial2 = img2$trial_number,
        Reality = resp2$Reality
      ),
      sort = FALSE
    )
  
  # Attention check
  taskchecks <- ifelse(is.na(resp1$AttentionCheck), NA, 0)
  taskchecks <- ifelse(resp1$AttentionCheck =="AI-Generated" & cue1$condition == "Fiction", 1, taskchecks)
  taskchecks <- ifelse(resp1$AttentionCheck=="Photograph" & cue1$condition == "Reality", 1, taskchecks)
  data_ppt$Task_AttentionCheck <- mean(taskchecks, na.rm = TRUE)
  
  # check column differences
  setdiff(names(alldata), names(data_ppt))  # columns in df1 but not in df2
  setdiff(names(data_ppt), names(alldata))  # columns in df2 but not in df1

  # Save all
  alldata <- rbind(alldata, data_ppt)
  alldata_task <- rbind(alldata_task, data_task)
}

if (nrow(alldata[duplicated(alldata), ]) > 0) {
  stop("Duplicates detected!")
}

# Anonymize ---------------------------------------------------------------
alldata$ID <- NULL
alldata$AttentionScore <- NULL

# Generate IDs
ids <- paste0("S", format(sprintf("%03d", 1:nrow(alldata))))
# Sort Participant according to date and assign new IDs
names(ids) <- alldata$Participant[order(alldata$Experiment_StartDate)]
# Replace IDs
alldata$Participant <- ids[alldata$Participant]
alldata_task$Participant <- ids[alldata_task$Participant]
alldata_task <- alldata_task[, c(2,3,1,4,5,6,7,8,9,10,11,12)]


write.csv(alldata, "../data/rawdata_participants.csv", row.names = FALSE)
write.csv(alldata_task, "../data/rawdata_task.csv", row.names = FALSE)




#notes
# -demog - duration
# -condition (control, ....)
# -total/means/sum of scores for questionnaires 
# -