// Full screen
var fullscreen_text = "<p>The experiment will switch to full screen mode when you press the button below</p>"
var fullscreen_button = "Continue"

var fullscreen_on = {
    type: jsPsychFullscreen,
    message: fullscreen_text,
    button_label: fullscreen_button,
    fullscreen_mode: true,
    delay_after: 0,
}

var fullscreen_off = {
    type: jsPsychFullscreen,
    message: fullscreen_text,
    button_label: fullscreen_button,
    fullscreen_mode: false,
}

// Retrieve and save browser info ========================================================
var demographics_browser_info = {
    type: jsPsychBrowserCheck,
    data: {
        screen: "browser_info",
        date: new Date().toLocaleDateString("fr-FR"), // French format (=european) means dd/mm/yyyy
        time: new Date().toLocaleTimeString("fr-FR"), // French format (=european) means hh:mm:ss
    },
    on_finish: function (data) {
        dat = jsPsych.data.get().filter({ screen: "browser_info" }).values()[0]

        // Rename
        data["screen_height"] = dat["height"]
        data["screen_width"] = dat["width"]
    },
}

// Consent form ========================================================
const consent_form = {
    type: jsPsychSurvey,
    survey_json: function () {
        // Logo and title
        let text =
            "<img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/><br><br><br><br><br>" +
            "<h1>Informed Consent</h1>"

        // Main Text
        text +=
            // Overview
            "<p align='left'><b>Invitation to Take Part</b><br>" +
            "Thank you for taking part in this study conducted by the Discovery Statistics team (see contact information below) as part of the Discovering Statistics module. </p>" +
            // Description
            "<p align='left'><b>Why have I been invited and what will I do?</b><br>" +
            "The goal is to study how <b>new technology</b> impacts <b>human perception</b>. In this study, you will be shown facial images and asked to complete a few questionnaires and perform some tasks." +
            " The whole experiment will take you <b style='color:#FF5722;'>~xx min</b> to complete. Please make sure that you are <b>attentive</b>.</p>" +
            // Results and personal information
            "<p align='left'><b>What will happen to the results and my personal information?</b><br>" +
            "The results of this research may be written into a scientific publication. Your anonymity will be ensured in the way described in the consent information below. <b>Please read this information carefully</b> and then, if you wish to take part, please acknowledge that you have fully understood this sheet, and that you consent to take part in the study as it is described here.</p>" +
            "<p align='left'><b>Consent</b><br></p>" +
            // Bullet points
            "<li align='left'>I understand that by signing below I am agreeing to take part in the University of Sussex research described here, and that I have read and understood this information sheet.</li>" +
            "<li align='left'>I understand that my participation is entirely voluntary, that I can choose not to participate in part or all of the study, and that I can withdraw at any stage without having to give a reason and without being penalized in any way (e.g., if I am a student, my decision whether or not to take part will not affect my grades).</li>" +
            "<li align='left'>I understand that since the study is anonymous, it will be impossible to withdraw my data once I have completed it.</li>" +
            "<li align='left'>I understand that my personal data will be used for the purposes of this research study and will be handled in accordance with Data Protection legislation. I understand that the University's Privacy Notice provides further information on how the University uses personal data in its research.</li>" +
            "<li align='left'>I understand that my collected data will be stored in a de-identified way. De-identified data may be made publicly available through secured scientific online data repositories.</li>"

        // End
        text +=
            "<li align='left'>By participating, you agree to follow the instructions and provide honest answers. If you do not wish to participate or if you don't have the time, simply close your browser.</li></p>" +
            "<p align='left'><br><sub><sup>For further information about this research, or if you have any concerns, please contact Dr Reny Baykova (<i style='color:DodgerBlue;'>R.Baykova@sussex.ac.uk</i>), and/or Dr Dominique Makowski (<i style='color:DodgerBlue;'>D.Makowski@sussex.ac.uk</i>) and/or Dr Danielle Evans (<i style='color:DodgerBlue;'>D.evans@sussex.ac.uk</i>) and/or Prof Andy Field (<i style='color:DodgerBlue;'>Andy.Field@sussex.ac.uk</i>). This research has been approved (xx/xxx/x) by the Sciences & Technology Cross-Schools Research Ethics Committee (C-REC) (<i style='color:DodgerBlue;'>crecscitec@sussex.ac.uk</i>). The University of Sussex has insurance in place to cover its legal liabilities in respect of this study.</sup></sub></p>"

        // Return Survey
        return {
            showQuestionNumbers: false,
            completeText: "I read, understood, and I consent",
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            name: "ConsentForm",
                            html: text,
                        },
                    ],
                },
            ],
        }
    },
    on_finish: function (data) {
        data.condition = condition // saves condition only for this consent trial
    },
}

// Demographic info ========================================================================
const demographics_questions = {
    type: jsPsychSurvey,
    survey_json: {
        title: "About yourself",
        completeText: "Continue",
        pageNextText: "Next",
        pagePrevText: "Previous",
        goNextPageAutomatic: false,
        showQuestionNumbers: false,
        pages: [
            {
                elements: [
                    {
                        type: "text",
                        title: "Please enter your age (in years)",
                        name: "Age",
                        isRequired: true,
                        inputType: "number",
                        min: 0,
                        max: 100,
                        placeholder: "e.g., 21",
                    },
                    {
                        title: "How would you describe your gender",
                        name: "Gender",
                        type: "radiogroup",
                        choices: ["Male", "Female", "Prefer not to say"],
                        showOtherItem: true,
                        otherText: "In another way",
                        otherPlaceholder: "Please specify",
                        isRequired: true,
                        colCount: 0,
                    },

                    {
                        title: "What sexual orientation do you identify with?",
                        description: "These questions are important to understand the results in the latter part of the experiment.",
                        name: "SexualOrientation",
                        type: "radiogroup",
                        choices: ["Heterosexual", "Homosexual", "Bisexual"],
                        showOtherItem: true,
                        otherText: "Other",
                        otherPlaceholder: "Please specify",
                        isRequired: true,
                        colCount: 1,
                    },
                    {
                        title: "How would you describe your ethnicity?",
                        description: "These questions are helpful to better characterize our sample and prevent overgeneralization.",
                        name: "Ethnicity",
                        type: "radiogroup",
                        choices: [
                            "White",
                            "Black",
                            "Hispanic/Latino",
                            "Middle Eastern/North African",
                            "South Asian",
                            "East Asian",
                            "Southeast Asian",
                            "Mixed",
                            "Prefer not to say",
                        ],
                        showOtherItem: true,
                        otherText: "Other",
                        otherPlaceholder: "Please specify",
                        isRequired: false,
                        colCount: 1,
                    },
                ],
            },
        ],
    },
    data: {
        screen: "demographic_questions",
    },
}

// Thank you ========================================================================

const experiment_feedback = {
    type: jsPsychSurvey,
    survey_json: {
        title: "Feedback",
        description: "It is the end of the experiment! Don't hesitate to leave us a feedback.",
        completeText: "Next",
        showQuestionNumbers: false,
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "Feedback_Alert",
                        html: "<p><b style='color:red;'>Answers to these questions will not affect your reward but will help us to better understand your answers.</b></p>",
                    },
                    {
                        type: "rating",
                        name: "Feedback_Enjoyment",
                        title: "Did you enjoy doing this experiment?",
                        isRequired: false,
                        rateMin: 0,
                        rateMax: 4,
                        rateType: "stars",
                    },
                    {
                        type: "rating",
                        name: "Feedback_Quality",
                        title: "To what extent did you do the experiment carefully and thoroughly?",
                        description: "Please be honest!",
                        isRequired: false,
                        rateMin: 0,
                        rateMax: 4,
                    },
                    {
                        type: "comment",
                        name: "Feedback_Text",
                        title: "Anything else you would like to share with us?",
                        description:
                            "Please note that these comments might be shared publicly as part of the results of this study - avoid sharing personal information.",
                        isRequired: false,
                    },
                ],
            },
        ],
    },
    data: {
        screen: "experiment_feedback",
    },
}

const demographics_debriefing = {
    type: jsPsychSurvey,
    survey_json: {
        showQuestionNumbers: false,
        completeText: "Continue",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "Debrief",
                        html: `
<img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='150px' align='right'/><br><br><br><br><br>
<h3>Debriefing</h3>
<p align='left'>
The purpose of this study was actually to study the effect on perceived attractiveness and trustworthiness of <i>believing</i> that the content is fake (AI-generated or real).
Our hypothesis is that believing that something is AI-generated would lead to lower attraction and trustworthiness ratings.
As we are primarily interested in your <i>beliefs</i> about reality, <b>all images were in fact taken from an existing database of real paintings</b> used in psychology research to study aesthetic judgments.
We apologize for the necessary deception used in the instructions (as there were no AI-generated images!), and we hope that you understand its role in ensuring the validity of our experiment.</p>
<p align='left'><b>Thank you again!</b> Your participation in this study will be kept completely confidential. If you have any questions or concerns about the project, please contact D.Makowski@sussex.ac.uk. and/or R.Baykova@sussex.ac.uk and/or D.evans@sussex.ac.uk. </p>
<p>To complete your participation in this study, click on 'Continue' and <b style="color: red">wait until your responses have been successfully saved</b> before closing the tab.</p> 
                            `,
                    },
                ],
            },
        ],
    },
    data: {
        screen: "demographics_debrief",
    },
}

const demographics_endscreen = {
    type: jsPsychSurvey,
    survey_json: function () {
        text = "<h2 style='color:green;'>Data saved successfully!</h2>" + "<p>Thank you for participating, it means a lot to us.</p>"

        // Return survey
        return {
            showQuestionNumbers: false,
            completeText: "End",
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            name: "Endscreen",
                            html: text,
                        },
                    ],
                },
            ],
        }
    },
    data: {
        screen: "demographics_endscreen",
    },
}
