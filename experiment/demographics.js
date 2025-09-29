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

        // Add URL variables - ?sona_id=x&exp=1
        let urlvars = jsPsych.data.urlVariables()
        data["researcher"] = urlvars["exp"]
        data["sona_id"] = urlvars["sona_id"]
        data["prolific_id"] = urlvars["PROLIFIC_PID"] // Prolific
        data["study_id"] = urlvars["STUDY_ID"] // Prolific
        data["session_id"] = urlvars["SESSION_ID"] // Prolific
    },
}

// Consent form ========================================================
const consent_form = {
    type: jsPsychSurvey,
    survey_json: function () {
        return {
            showQuestionNumbers: false,
            completeText: "Continue",
            pages: [
                {
                    elements: [
                        // Info text first
                        {
                            type: "html",
                            name: "infomation_sheet",
                            html: `
                <img src='https://blogs.brighton.ac.uk/sussexwrites/files/2019/06/University-of-Sussex-logo-transparent.png' width='200px' align='right'/>
                <h1>Informed Consent</h1>
                <p align='left'><b>Invitation to Take Part</b><br>
                You are being invited to take part in a research study to further our understanding of attitudes towards artificial intelligence (AI). 
                Thank you for carefully reading this information sheet, a copy of which you can keep for your records. 
                This study is being conducted by Dr Reny Baykova, Dr Danielle Evans, Dr Andy Field, and Dr Dominique Makowski. 
                If you have any questions about the experiment, please contact Dr Reny Baykova at <i style='color:DodgerBlue;'>r.baykova@sussex.ac.uk.</i></p>
               
               
                <p align='left'><b>Why have I been invited to take part?</b><br>
                We are inviting all students currently enrolled on the Discovering Statistics module to take part in the study.

                <p align='left'><b>Do I have to take part?</b><br>
                Participation in the study is optional and voluntary - it is up to you to decide whether to take part. 
                If you do decide to take part you will be asked to complete a consent form before you begin the experiment. 
                Even if you decide to take part in the study, you are still free to withdraw at any time and without providing any explanation for your decision. 
                As we are not collecting any personally identifiable information, it will not be possible to withdraw your data after you submit it. 
                Once you reach the end of the experiment, a message will appear on the screen asking whether you want to submit your data (reminding you it is impossible to delete once submitted).

                <p>Importantly, non-participation or withdrawal from the study will not affect grades or your relationship with the University of Sussex. 
                Likewise, your performance in the study will also not have an effect on your grades or your relationship with the University.</p>

                <p align='left'><b>What will happen during the experiment?</b><br>
                The study will take place in Pevensey 1, 2D8 during your usual practical class in Week 1 of term. 
                If you miss your practical, you will have the opportunity to complete the study at your own time. 
                The study will take about <b style='color:#FF5722;'>~25 min</b> minutes to complete.
                <p>You will complete 3 questionnaires. One questionnaire is interested in your attitudes towards AI. 
                In the second questionnaire, your task is to label news headlines are real or fake. In the third questionnaire, you have to decide how meaningful different statements are.</p>
                <p>You will also complete a face-perception task, in which you will be presented with real or AI-generated faces. 
                You will rate how attractive, beautiful and symmetry the faces look. 
                You will receive a full debrief about the purpose of the experiment once data collection ends next week, and in the lecture in Week 3 which will be delivered by Dr Dominique Makowski. </p>

                <p align='left'><b>What will happen to the data collected during the experiment?</b><br>
                You will use the data collected during the experiment for the lab report you will submit in Week 11. As stated under “Do I have to take part?”, your performance in the study, or your decision to not participant or withdraw from the study will not have any effect on your mark on the lab report.
                <p>The data from this study may also be presented in conferences and scientific publications, or it may be used in future studies.</p>
                
                <p align='left'><b>Will my information in this study be kept confidential?</b><br>
                We will not ask you for any information that directly identifies you. We will also not disclose any information provided by you during the research without your written permission or as required by law.
                <p>The date and time at which you complete the experiment could indicate which practical group you are from, so a researcher who doesn’t teach on the Discovering Statistics module (Dr Dominique Makowski) will alter this information from the collected data before sharing it with the teaching team and with you.</p>
                Similarly, the demographic information you provide will also be altered prior to sharing the data with the cohort. 
                The correct, unaltered data will be kept separately and securely from the data that is shared with the students.
                
                <p align='left'><b>Who has approved this study?</b><br>
                This study has been approved by the SEMSET Faculty Research Ethics Committee, and the project reference number is 240.
                
                <p align='left'><b>Contact for Further Information</b><br>
                If you have any problems, concerns or questions about this study, you should get in touch with Dr Reny Baykova (<i style='color:DodgerBlue;'>r.baykova@sussex.ac.uk.</i>). 
                If you have any concerns about the way in which the study has been conducted, you should contact the SEMSET Faculty Research Ethics Committee at <i style='color:DodgerBlue;'>frecsemset@sussex.ac.uk</i>.               
                
                <p align='left'><b>Insurance</b><br></p>
                University of Sussex has insurance in place to cover its legal liabilities in respect of this study.
                
                <p align='left'><b>Consent</b><br></p>
              `,
                        },
                        // Consent checkboxes
                        {
                            type: "checkbox",
                            name: "consent_1",
                            title: "If you agree to participate in this study, then please read the following statements, and tick the box next to each statement to indicate consent.",
                            choices: [
                                "I have read and understood the Information Form which I may keep for my records.",
                                "I understand that my participation is entirely voluntary, that I can choose not to participate in part or all of the study, and that I can withdraw at any stage before submitting my data without having to give a reason and without being penalised in any way.",
                                "I understand that my performance in the study and whether I decide not to participate or to withdraw from the study will not affect my marks in the assessments in Discovering Statistics.",
                                "I understand that since the study is anonymous, and no directly identifiable information will be collected (e.g., names or emails), it will be impossible to withdraw my data once I have completed the study and submitted my data.",
                                "I understand that my personal data will be used for the purposes of this research study and will be handled in accordance with Data Protection legislation. I understand that the University's Privacy Notice (https://www.sussex.ac.uk/about/website/privacy-and-cookies/privacy) provides further information on how the University uses personal data in its research.",
                                "I understand that my collected data will be stored in a de-identified way (e.g., using randomly assigned ID numbers). Electronic data will be stored securely on a university managed system (OneDrive).",
                                "I understand that my identity will remain confidential in any written reports of this research, and that no information I disclose will lead to the identification in those reports of any individual either by the researchers or by any other party, without first obtaining my written permission.",
                                "I understand that the de-identified research data may be shared on online repositories and may be used in future studies.",
                                "I understand that the research data collected as part of this study may be presented in publications and at conferences.",
                                "I understand direct quotes from my responses may be published in articles or presented at conferences.",
                            ],
                            isRequired: true,
                            validators: [
                                {
                                    type: "answercount",
                                    minCount: 10, // number of checkboxes in choices
                                    maxCount: 10,
                                    text: "You must agree to all statements before continuing.",
                                },
                            ],
                        },
                        {
                            type: "checkbox",
                            name: "consent_2",
                            title: "By participating, you agree to follow the instructions and provide honest answers. If you do not wish to participate, simply close your browser.",
                            choices: [
                                "Please tick this box if you consent to taking part in this study:",
                            ],
                            isRequired: true,
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
        description: "Please answer the following questions about yourself:",
        completeText: "Continue",
        pageNextText: "Next",
        pagePrevText: "Previous",
        goNextPageAutomatic: false,
        showQuestionNumbers: false,
        pages: [
            {
                elements: [
                    {
                        title: "How would you describe your gender",
                        name: "Gender",
                        type: "radiogroup",
                        choices: [
                            "Man",
                            "Woman",
                            "Non-binary",
                            "Prefer not to say",
                        ],
                        showOtherItem: true,
                        otherText: "In another way",
                        otherPlaceholder: "Specify if you wish",
                        isRequired: true,
                        colCount: 0,
                    },
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
                        title: "What sexual orientation do you identify with?",
                        description:
                            "These questions are important to understand the results in the latter part of the experiment.",
                        name: "SexualOrientation",
                        type: "radiogroup",
                        choices: [
                            "Heterosexual",
                            "Homosexual",
                            "Bisexual",
                            "Prefer not to say",
                        ],
                        showOtherItem: true,
                        otherText: "In another way",
                        otherPlaceholder: "Specify if you wish",
                        isRequired: false,
                        colCount: 1,
                    },
                    {
                        title: "How would you describe your ethnicity?",
                        description:
                            "These questions are helpful to better characterize our sample and prevent overgeneralization.",
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
                        otherText: "In another way",
                        otherPlaceholder: "Specify if you wish",
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
        description:
            "It is almost the end of the experiment! Your data will be saved in the next step and you will be given information about this study. But before, don't hesitate to leave us some feedback.",
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
                    // {
                    //     type: "rating",
                    //     name: "Feedback_Quality",
                    //     title: "To what extent did you do the experiment carefully and thoroughly?",
                    //     description: "Please be honest!",
                    //     isRequired: false,
                    //     rateMin: 0,
                    //     rateMax: 4,
                    // },
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
The purpose and aim of this study will be explained to you <b>next week</b>. A message will be posted on Canvas, and a debrief will be provided once data collection is complete.<p align='left'>
<b>Thank you again!</b> Your participation in this study will be kept completely confidential. If you have any questions or concerns about the project, please contact <i style='color:DodgerBlue;'>D.Makowski@sussex.ac.uk</i> and/or <i style='color:DodgerBlue;'>R.Baykova@sussex.ac.uk</i>.</p>
<p><b style='color:red;'>If you wish to withdraw your data, please close this tab now.</b>
<b>Once you click 'Continue' and your data is saved, it will not be possible to withdraw your data.</b>


<p>To complete your participation in this study, click on 'Continue' and <b style="color: green">wait until your responses have been successfully saved</b> before closing the tab.</p> 
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
        text =
            "<h2 style='color:green;'>Data saved successfully!</h2>" +
            "<p>Thank you for participating, it means a lot to us.</p>"

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
