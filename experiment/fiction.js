// Condition assignment ============================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

// Condition assignment ============================================
function assignCondition(stimuli_list) {
    let new_stimuli_list = []
    // Loop through unique categories
    for (let cat of [...new Set(stimuli_list.map((a) => a.Category))]) {
        // Get all stimuli of this category
        var cat_stimuli = stimuli_list.filter((a) => a.Category == cat)

        // Shuffle cat_stimuli
        cat_stimuli = shuffleArray(cat_stimuli)

        // Assign conditions
        let conditions = ["Reality", "Fiction"]
        let half = Math.floor(cat_stimuli.length / 2)
        let remainder = cat_stimuli.length % 2

        let index = 0
        // First assign evenly
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < half; j++) {
                cat_stimuli[index].Condition = conditions[i]
                index++
            }
        }

        // If odd number, assign the leftover randomly
        if (remainder > 0) {
            let shuffledConditions = shuffleArray(conditions)
            cat_stimuli[index].Condition = shuffledConditions[0]
            index++
        }

        // Add to new_stimuli_list
        new_stimuli_list.push(...cat_stimuli)
    }
    return shuffleArray(new_stimuli_list)
}

// Function used to insert catch-trials ("what was the label?") in some trials
function generateRandomNumbers(min, max, N) {
    return [...Array(max - min + 1).keys()]
        .map((i) => i + min)
        .sort(() => Math.random() - 0.5)
        .slice(0, N)
        .sort((a, b) => a - b) // Sort the numbers in ascending order
}

// Variables ===================================================================
var fiction_trialnumber = 1
var color_cues = shuffleArray(["red", "blue", "green"])
color_cues = { Reality: color_cues[0], Fiction: color_cues[1] }
var text_cue = { Reality: "Photograph", Fiction: "AI-generated" }
stimuli = assignCondition(stimuli_list)

// We make 9 catch trials (always starting from 2 = the first trial)
catch_trials = [2].concat(generateRandomNumbers(3, stimuli_list.length, 8))

// Screens =====================================================================
const fiction_instructions1 = {
    type: jsPsychSurvey,
    data: { screen: "fiction_instructions1" },
    survey_json: {
        showQuestionNumbers: false,
        completeText: "Let's start",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "Instructions1",
                        html: `
<div style="display: flex; justify-content: space-between; align-items: flex-start;">
    <h1 style="margin: 0;">Instructions</h1>
    <img src="media/Psychology.png" alt="School of Psychology logo" style="height: 10vh; width: auto;" />
</div>
<h3>Real and AI Faces</h3>
<p>The task you are about to do stems out of an exciting collaboration between the <b>School of Psychology</b> and the <b>School of Informatics</b> aimed at better understanding the ethical implications of AI technology.</p>
<p>Our goal is to better understand how various people react and judge various faces.</p>
<div style="display: flex; gap: 24px; align-items: flex-start;">
    <div style="flex: 1 1 60%; text-align: left;">
        <p>For this, we created bespoke face images using an adapted version of a <i>Generative Adversarial Network</i> (GAN) algorithm.</p>
        <p>This face-generation algorithm used photographs of real faces from the <b style="color: #1A237E">Face Research Lab London Database</b> set of images (DeBruine & Jones, 2024), to ensure that the generated faces were as <b>realistic and homogeneous</b> (grey background, white T-shirt, consistent lightning and exposure, etc.) as possible.</p>
        <p>(Note: if you are interested, more technical details will be provided at the end of the experiment with a link to the algorithm documentation.)</p>

        <div style="text-align: center; margin-top: 12px;">
            <img src="media/example.png" alt="Example of GAN-based face generation using a target reference image" style="max-width: 60%; height: auto; display: inline-block;" />
        </div>

        <p>You will be presented with <b>faces generated</b> by our <b>algorithm</b> mixed with <b>real faces</b> from the <b>database</b> (preceded by the word '<b style="color: ${color_cues["Fiction"]}">AI-generated</b>' or '<b style="color: ${color_cues["Reality"]}">Photograph</b>').</p>
        
    </div>
    <div style="flex: 0 0 40%; max-width: 40%; text-align: right;">
        <img src="media/gan.gif" alt="GAN illustration" style="width: 100%; height: auto; display: block;" />
            <div style="color: #666; font-style: italic; font-size: 0.9em; margin-top: 8px;">
                Example of GAN-based face generation using a target reference image
            </div>
    </div>

</div>
<h3>What you will see</h3>
<p>In the next phase, images of faces will be presented for a brief amount of time. <b>These will include images generated by our algorithm, mixed with real faces from the original database</b>. Each image will be preceded by a label (the words '<b style="color: ${color_cues["Fiction"]}">AI-generated</b>' or '<b style="color: ${color_cues["Reality"]}">Photograph</b>') to indicate whether it is a real face or a generated one.</p>
`,
                    },
                ],
            },
            {
                elements: [
                    {
                        type: "html",
                        name: "Instructions2",
                        html: `
        <style>
            .instr2-wrap { display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap; }
            .instr2-left { flex: 2 1 360px; text-align: left; }
            .instr2-right { flex: 1 1 320px; max-width: 40%; text-align: right; }
            @media (max-width: 900px) {
                .instr2-right { max-width: 100%; text-align: center; }
            }
        </style>
        <h1>Instructions</h1>
        <h3>What you need to do</h3>
        <div class="instr2-wrap">
            <div class="instr2-left">
                <p> After showing a label indicating the type of image (AI-generated or Photograph), a face will be briefly presented on the screen.
                <b>We would like you to imagine that you are meeting this person for the first time in real life.</b></p>   
                After each image, you will be asked to rate these faces on the following:</p>
                <ul>
                    <li><b style="color: #FF5722"> Attractiveness</b>: To what extent do <b>you personally</b> find the person <b>attractive</b> (how drawn are you to this person, to what extent would you be in principle interested in getting to know them better).</li>
                    <li><b style="color: #9C27B0"> Beauty</b>: To what extent do you think the face is "objectively" <b>beautiful</b> (the degree to which the face is appealing based on aesthetic criteria).</li>
                    <!-- <li><b style="color: #3F51B5"> Trustworthiness</b>: To what extent do you find this person <b>trustworthy</b> (reliable, honest, responsible, etc.).</li> -->
                     <li><b style="color: #3F51B5"> Symmetry</b>: To what extent was this face <b>symmetrical</b> (the degree to which the left and right sides of the face are identical).</li> 
                </ul>
                <p><u>Important:</u> While beauty can often be aligned with attractiveness, they are not necessarily the same: we can sometimes find attractive a person with a face not conventionally beautiful and vice versa. Similarly, a symmetric face does not necessarily correspond to a beautiful face (or an attractive one).</p>
                <p>Press start once you are ready. Note that the images are presented very briefly: we are interested in your <b>first impression</b>.</p>
            </div>
            <div class="instr2-right">
                <img src="media/example_scales.png" alt="Example of the rating scales" style="max-width: 100%; height: auto; max-height: 90vh; display: inline-block;" />
            </div>
        </div>`,
                    },
                ],
            },
        ],
    },
}

const fiction_expectations = {
    type: jsPsychSurvey,
    data: { screen: "fiction_expectations" },
    survey_json: function () {
        let suggestion = ""

        if (condition == "More attractive") {
            suggestion = `
                    <h3 style='text-align: center; max-width: 1000px;'>Information</h3>
                    <p style='max-width: 1000px;'>In a survey of 1,442 respondents, Johnson and Lee (2021) found that people on average <b>rated AI-generated faces as more beautiful than real faces</b>. 
                    This effect was later replicated in an experiment by Martinez and colleagues (2022), who reported a 34% increase in attractiveness ratings when comparing AI-generated faces to real ones.<p>
                    <p>Do you think you tend to follow a similar pattern?</p>
                    `
        } else if (condition == "Less attractive") {
            suggestion = `
                    <h3 style='text-align: center; max-width: 1000px;'>Information</h3>
                    <p style='max-width: 1000px;'>In a survey of 1,442 respondents, Johnson and Lee (2021) found that people on average <b>rated AI-generated faces as less beautiful than real faces</b>. 
                    This effect was later replicated in an experiment by Martinez and colleagues (2022), who reported a 34% decrease in attractiveness ratings when comparing AI-generated faces to real ones.<p>
                    <p>Do you think you tend to follow a similar pattern?</p>
                    `
        } else {
            suggestion = "<h3 style='text-align: center; max-width: 1000px;'>Before you start</h3>"
        }

        return {
            showQuestionNumbers: false,
            completeText: "Start the experiment!",
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            html: suggestion,
                        },
                        {
                            title: "Based on your experience, do you expect to find AI-generated faces more or less attractive compared to real faces?",
                            description:
                                "Note that our algorithm was designed and trained to generate realistic faces with no prompting related to beauty.",
                            name: "expectations",
                            type: "radiogroup",
                            choices: [
                                "I expect to find AI-generated faces more attractive",
                                "I expect to find AI-generated faces less attractive",
                                "I expect to find AI-generated faces similarly attractive",
                                "I have no expectations",
                            ],
                            isRequired: true,
                        },
                    ],
                },
            ],
        }
    },
    on_finish: function (data) {
        data.condition = condition
    },
}

const fiction_instructions2 = {
    type: jsPsychSurvey,
    data: { screen: "fiction_instructions2" },
    on_finish: function () {
        fiction_trialnumber = 1 // Reset trial counter
    },
    survey_json: {
        showQuestionNumbers: false,
        completeText: "Start",
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "Instructions",
                        html: `
<h1>AI... or not?</h1>
<h2>Instructions</h2>
<div style="display: flex; gap: 20px; align-items: flex-start;">
    <div style="flex: 1; min-width: 100px;"> <img src="media/illustration_realitytask.jpg" alt="Is it AI or real?" style="max-width: 100%; height: auto; display: block;">
</div>
<div style="flex: 2; text-align: left;">
        <p><b>Thank you for staying with us so far!</b></p>
        <p>There is <b>something important</b> we need to reveal... In the previous phase, the labels ('<b style="color: ${color_cues["Fiction"]}">AI-generated</b>' or '<b style="color: ${color_cues["Reality"]}">Photograph</b>') were actually <b>mixed-up</b>! As a result, they were correct for some faces but wrong for others (e.g., the label said "AI" but the face was actually a photo, or vice versa).</p>
        <p>In this final phase, we want you to try to identify <b>the correct category</b> of each image. We will briefly present all the faces once more, followed by one question about whether you think the face image is a real photograph from the original picture database or an AI-generated image</p>
        <p>Sometimes, it is hard to tell, but don't overthink it and <b>go with your gut feeling</b>. At the end, we will tell you if you were correct or wrong!</p>
    </div>
</div>
`,
                    },
                ],
            },
        ],
    },
}

var fiction_preloadstims = {
    type: jsPsychPreload,
    images: stimuli_list.map((a) => "stimuli/" + a.Item),
    message: "Please wait while the experiment is being loaded (it can take a few minutes)",
}

var fiction_fixation1a = {
    type: jsPsychHtmlKeyboardResponse,
    // on_start: function () {
    //     document.body.style.cursor = "none"
    // },
    stimulus: "<div style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
    choices: ["s"],
    trial_duration: 500,
    save_trial_parameters: { trial_duration: true },
    data: {
        screen: "fiction_fixation1a",
    },
}

var fiction_cue = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        var cond = jsPsych.evaluateTimelineVariable("Condition")
        return (
            "<div style='font-size:450%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%; color: " +
            color_cues[cond] +
            "'><b>" +
            text_cue[cond] +
            "</b></div>"
        )
    },
    data: function () {
        var cond = jsPsych.evaluateTimelineVariable("Condition")
        return {
            screen: "fiction_cue",
            color: color_cues[cond],
            condition: cond,
            item: jsPsych.evaluateTimelineVariable("Item"),
        }
    },
    choices: ["s"],
    trial_duration: 1000,
    save_trial_parameters: { trial_duration: true },
}

var fiction_fixation1b = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
    choices: ["s"],
    trial_duration: 500,
    save_trial_parameters: { trial_duration: true },
    data: function () {
        return {
            screen: "fiction_fixation1b",
            item: jsPsych.evaluateTimelineVariable("Item"),
            window_width: window.innerWidth,
            window_height: window.innerHeight,
        }
    },
}

var fiction_showimage1 = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/" + jsPsych.evaluateTimelineVariable("Item")
    },
    // Random duration (750ms - 3750ms)
    trial_duration: function () {
        return jsPsych.randomization.randomInt(750, 3750)
    },
    choices: ["s"],
    stimulus_width: function () {
        return Math.floor(0.9 * Math.min(window.innerWidth, window.innerHeight))
    },
    stimulus_height: function () {
        return Math.floor(0.9 * Math.min(window.innerWidth, window.innerHeight))
    },
    save_trial_parameters: { trial_duration: true },
    data: function () {
        return {
            screen: "fiction_image1",
            item: jsPsych.evaluateTimelineVariable("Item"),
            window_width: window.innerWidth,
            window_height: window.innerHeight,
            trial_number: fiction_trialnumber,
        }
    },
    on_finish: function () {
        fiction_trialnumber += 1
    },
}

fiction_scales1 = [
    // Empty HTML element used to specify the width of the sliders
    {
        type: "html",
        html: `
<p class="responsive-box-for-survey"> </p>
<style>
  .responsive-box-for-survey {
    width: 100%;      /* default: take full screen width */
    height: 1px;
  }
  @media (min-width: 600px) {
    .responsive-box-for-survey {
      width: 600px;   /* fixed width once screen is ≥600px */
    }
  }
</style>`,
    },
    {
        type: "slider",
        name: "Attractiveness",
        title: "How attractive did you find this person?",
        isRequired: true,
        min: -100,
        max: 100,
        step: 1,
        customLabels: [
            {
                value: -100,
                text: "Very unattractive",
            },
            {
                value: 100,
                text: "Very attractive",
            },
        ],
        // defaultValue: 0,
    },
    {
        type: "slider",
        name: "Beauty",
        title: "This face was...",
        isRequired: true,
        min: -100,
        max: 100,
        step: 1,
        customLabels: [
            {
                value: -100,
                text: "Ugly",
            },
            {
                value: 100,
                text: "Beautiful",
            },
        ],
    },
    // {
    //     type: "rating",
    //     name: "Trustworthiness",
    //     title: "I find this face trustworthy.",
    //     isRequired: true,
    //     rateMin: 0,
    //     rateMax: 6,
    //     minRateDescription: "Disagree",
    //     maxRateDescription: "Agree",
    //     displayMode: "buttons",
    // },
    {
        type: "slider",
        name: "Symmetry",
        title: "This face was...",
        isRequired: true,
        min: -100,
        max: 100,
        step: 1,
        customLabels: [
            {
                value: -100,
                text: "Asymmetric",
            },
            {
                value: 100,
                text: "Symmetric",
            },
        ],
    },
]

var fiction_ratings1 = {
    type: jsPsychSurvey,
    survey_json: function () {
        return {
            goNextPageAutomatic: false,
            showQuestionNumbers: false,
            showNavigationButtons: true,
            title: "Picture " + (fiction_trialnumber - 1) + "/" + stimuli.length,
            pages: [{ elements: fiction_scales1 }],
        }
    },
    data: {
        screen: "fiction_ratings1",
    },
}

var fiction_ratings1_check = {
    type: jsPsychSurvey,
    survey_json: function () {
        return {
            goNextPageAutomatic: false,
            showQuestionNumbers: false,
            showNavigationButtons: true,
            title: "Picture " + (fiction_trialnumber - 1) + "/" + stimuli.length,
            pages: [
                {
                    elements: fiction_scales1.concat([
                        {
                            title: "What was the category of the image?",
                            name: "AttentionCheck",
                            type: "radiogroup",
                            choices: ["AI-Generated", "Photograph", "I don't remember"],
                            showOtherItem: false,
                            isRequired: true,
                            colCount: 0,
                        },
                    ]),
                },
            ],
        }
    },
    data: {
        screen: "fiction_ratings1",
    },
}

// The rating screens are created as conditional timelines to allow for dynamic changes
// (with or without the attention check question) depending on the trial number
var t_fiction_ratings1_check = {
    timeline: [fiction_ratings1_check],
    conditional_function: function () {
        if (catch_trials.includes(fiction_trialnumber)) {
            return true
        } else {
            return false
        }
    },
}

var t_fiction_ratings1_nocheck = {
    timeline: [fiction_ratings1],
    conditional_function: function () {
        if (catch_trials.includes(fiction_trialnumber)) {
            return false
        } else {
            return true
        }
    },
}

var fiction_phase1 = {
    timeline_variables: stimuli, //.slice(0, 2), // <---------------------------- TODO: remove the extra slicing added for testing
    timeline: [
        fiction_fixation1a,
        fiction_cue,
        fiction_fixation1b,
        fiction_showimage1,
        t_fiction_ratings1_check,
        t_fiction_ratings1_nocheck,
    ],
}

// Stage 2 loops and variables

var fiction_fixation2 = {
    type: jsPsychHtmlKeyboardResponse,
    // on_start: function () {
    //     document.body.style.cursor = "none"
    // },
    stimulus: "<div  style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
    choices: ["s"],
    trial_duration: 500,
    save_trial_parameters: { trial_duration: true },
    data: { screen: "fiction_fixation2" },
}

var fiction_showimage2 = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/" + jsPsych.evaluateTimelineVariable("Item")
    },
    stimulus_width: function () {
        return Math.floor(0.9 * Math.min(window.innerWidth, window.innerHeight))
    },
    stimulus_height: function () {
        return Math.floor(0.9 * Math.min(window.innerWidth, window.innerHeight))
    },
    trial_duration: 1500,
    choices: ["s"],
    save_trial_parameters: { trial_duration: true },
    data: function () {
        return {
            screen: "fiction_image2",
            trial_number: fiction_trialnumber,
            item: jsPsych.evaluateTimelineVariable("Item"),
        }
    },
    on_finish: function () {
        fiction_trialnumber += 1
    },
}

var fiction_ratings2 = {
    type: jsPsychSurvey,
    survey_json: function () {
        return {
            goNextPageAutomatic: false,
            showQuestionNumbers: false,
            showNavigationButtons: true,
            title: "Picture " + (fiction_trialnumber - 1) + "/" + stimuli.length,
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            name: "Instructions",
                            html: `
<p class="responsive-box-for-survey">The labels we showed you in the previous phase have been mixed up! Can you tell which category each image belongs to?</p>
<style>
  .responsive-box-for-survey {
    width: 100%;      /* default: take full screen width */
    height: 1px;
  }
  @media (min-width: 600px) {
    .responsive-box-for-survey {
      width: 600px;   /* fixed width once screen is ≥600px */
    }
  }
</style>`,
                        },
                        {
                            type: "slider",
                            name: "Reality",
                            title: "I think this face is...", // "Indicate your confidence that the image is a human or AI creation"
                            description: "Indicate your confidence that the image is AI-generated or real",
                            isRequired: true,
                            // minWidth: "200%",
                            // maxWidth: "200%",
                            min: -100,
                            max: 100,
                            step: 1,
                            customLabels: [
                                {
                                    value: -100,
                                    text: "AI-generated",
                                },
                                {
                                    value: 100,
                                    text: "Photograph",
                                },
                            ],
                            // defaultValue: 0,
                        },
                    ],
                },
            ],
        }
    },
    data: {
        screen: "fiction_ratings2",
    },
}

var fiction_phase2 = {
    timeline_variables: shuffleArray(stimuli), //.slice(0, 2), // <------------------------------------------------------------------------ TODO: remove this
    timeline: [fiction_fixation2, fiction_showimage2, fiction_ratings2],
}

// Feedback ====================================================================

var fiction_feedback1 = {
    type: jsPsychSurvey,
    survey_json: {
        title: "Thank you!",
        description: "Before we start the second phase, we wanted to know your thoughts.",
        showQuestionNumbers: false,
        elements: [
            // {
            //     type: "checkbox",
            //     name: "Feedback_1",
            //     title: "Face Attractiveness",
            //     description: "Please select all that apply",
            //     choices: [
            //         "Some faces were really attractive",
            //         "No face was particularly attractive",
            //         "AI-generated images were more attractive than the photos",
            //         "AI-generated images were less attractive than the photos",
            //     ],
            //     showOtherItem: false,
            //     showSelectAllItem: false,
            //     showNoneItem: false,
            // },
            {
                type: "checkbox",
                name: "Feedback_2",
                title: "Feedback about the AI-Generation algorithm",
                description: "Please select all that apply",
                choices: [
                    "The difference between the photos and the AI-generated images was obvious",
                    "The difference between the photos and the AI-generated images was subtle",
                    "I didn't see any difference between photos and AI-generated images",
                    "I felt like the labels ('Photograph' and 'AI-Generated') were not always correct",
                    "I felt like the labels were reversed (e.g., 'Photograph' for AI-generated images and vice versa)",
                    "I feel like all the images were photos",
                    "I feel like all the images were AI-generated",
                ],
                showOtherItem: false,
                showSelectAllItem: false,
                showNoneItem: false,
            },
            {
                visibleIf: "{Feedback_2} anyof ['I feel like all the images were photos']",
                title: "How certain are you that all images were photos?",
                name: "Feedback_2_ConfidenceReal",
                type: "rating",
                rateMin: 0,
                rateMax: 5,
                minRateDescription: "Not at all",
                maxRateDescription: "Completely certain",
            },
            {
                visibleIf: "{Feedback_2} anyof ['I feel like all the images were AI-generated']",
                title: "How certain are you that all images were AI-generated?",
                name: "Feedback_2_ConfidenceFake",
                type: "rating",
                rateMin: 0,
                rateMax: 5,
                minRateDescription: "Not at all",
                maxRateDescription: "Completely certain",
            },
        ],
    },
    data: {
        screen: "fiction_feedback1",
    },
}
