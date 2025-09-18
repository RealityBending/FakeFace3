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

// We make 6 catch trials (always starting from 2 = the first trial)
catch_trials = [2].concat(generateRandomNumbers(3, stimuli_list.length, 5))

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
<h1>Instructions</h1>
<h3>What you will see</h3>
  <div style="text-align: left;">
   <p>This study stems out of an exciting new partnership between researchers from the <b>University of Sussex</b> and a young <b>AI startup</b> based in Brighton, UK, that specializes in making AI technology more ethical.</p>
   <p>Our goal is to better understand how various people react to different faces. 
   For this, we will be using a new <b>image-generation algorithm</b> (based on a modified <i>Generative Adversarial Network</i>) trained on large dataset of images from the <b style="color: #e70ae7ff">Face Research Lab London Database</b> (DeBruine & Jones, 2024).</p>
   <p>The algorithm was prompted to generate faces based on the characteristics of the faces in the database which were in turn taken from real individuals living in London.</p>
   
   <div style='text-align: center;'><img src='media/gan.gif' height='200'></img></div>

   <p>In the next part, you will be presented with <b>faces generated</b> by our <b>algorithm</b> mixed with <b>real faces</b> from the <b>database</b> (preceded by the word '<b style="color: ${color_cues["Fiction"]}">AI-generated</b>' or '<b style="color: ${color_cues["Reality"]}">Photograph</b>').</p>
   </div>
    </div>
  </div>
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
    <h1>Instructions</h1>
    <h3>What you need to do</h3>

    <div style="text-align: left;">
    <p> After showing a label indicating the origin of the image, a face will be briefly presented on the screen.
    After each image, you will be asked to <b> rate these faces on the following</b>:
     <ul>
        <li><b style="color: #FF5722"> Attractiveness</b>: To what extent do <b>you personally</b> find the person <b>attractive</b> (how drawn are you to this person). While this dimension can often be aligned with the previous ones, we can also sometimes a face not necessarily "conventionally" beautiful and yet very attractive (and vice versa).</li>    
        <li><b style="color: #9C27B0"> Beauty</b>:To what extent do you think the face is "objectively" <b>good-looking</b> (the degree to which the face is aesthetically appealing).</li>
        <li><b style="color: #3F51B5"> Trustworthiness</b>: To what extent do you find this person <b>trustworthy</b> (reliable, honest, responsible, etc.).</li>
    <ul>
    </div>
    <p>Note that we are interested in your <b>first impression</b>, so please respond according to your gut feelings.</p>
    <p>Press start once you are ready.</p>
    </div>`,
                    },
                ],
            },
        ],
    },
}

const demand_characteristics = {
    type: jsPsychSurvey,
    data: { screen: "demand_characteristics" },
    survey_json: function () {
        let preamble_text = ""

        if (condition == "Expectations") {
            preamble_text = `<div style="text-align: center;">
                    <p><b>Before you start!</b><p>
                    </div>`
        } else if (condition == "AI-more attractive") {
            preamble_text = `<div style="text-align: center;">
                    <p><b>Before you start!</b></p>
                    </div>
                    <p><b>Previous research</b> has found that people rate <b>AI-generated faces</b> as <b style="color: #ff2916ff">more attractive</b> than <b>real faces</b> (Johnson & Lee, 2021; Martínez et al., 2022).</p>
                    </div>`
        } else if (condition == "AI-less attractive") {
            preamble_text = `<div style="text-align: center;">
                    <p><b>Before you start!</b></p>
                    </div>
                    <div style="text-align: left;">
                    <p><b>Previous research</b> has found that people rate <b>AI-generated faces</b> as <b style="color: #ff2916ff">less attractive</b> than <b>real faces</b> (Johnson & Lee, 2021; Martínez et al., 2022).</p>
                    </div>`
        }
        return {
            showQuestionNumbers: false,
            completeText: "Continue",
            pages: [
                {
                    elements: [
                        {
                            type: "html",
                            html: preamble_text,
                        },
                        {
                            title: "Do you think you will find AI-generated faces more, less, or similarly attractive compared to real faces?",
                            name: "expectations",
                            type: "radiogroup",
                            choices: [
                                "More attractive",
                                "Less attractive",
                                "Similarly attractive",
                            ],
                            isRequired: true,
                        },
                    ],
                },
            ],
        }
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
<h1>Final task</h1>
<div style="display: flex; gap: 20px; align-items: flex-start;">
</div>
<div style="flex: 2; text-align: left;">
        <p>Thank you for staying with us so far!</p>
        <p>There is <b>something important</b> we need to reveal... In the previous phase, some faces were <b style='color: #E91E63'>intentionally mislabelled</b> (we told you it was AI-generated when it was actually a real photograph, or vice versa)...</p>
        <p>In this final phase, we want you to tell us <b>what <i>you</i> think is the correct category</b> of each image. We will briefly present all the faces once more, followed by two questions:</p>
        <ul>
            <li><b style="color: ${color_cues["Fiction"]}">AI-generated</b>' or '<b style="color: ${color_cues["Reality"]}">Photograph</b>' Do you think the face corresponds to an AI-generated image or a real photograph?Indicate your degree of <b>confidence</b> and certainty by selecting larger numbers.</p></li>
        </ul>
        <p>Sometimes, it is hard to tell, but don't overthink it and <b>go with your gut feeling</b>. At the end, we will tell you if you were correct or wrong!</p>
        <p>Press start once you are ready.</p>
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
    message:
        "Please wait while the experiment is being loaded (it can take a few minutes)",
}

var fiction_fixation1a = {
    type: jsPsychHtmlKeyboardResponse,
    // on_start: function () {
    //     document.body.style.cursor = "none"
    // },
    stimulus:
        "<div style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
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
    stimulus:
        "<div style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
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
    trial_duration: 5000,
    choices: ["s"],
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
    {
        type: "slider",
        name: "Attractiveness",
        title: "How attractive is this face to you?",
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
        type: "rating",
        name: "Beauty",
        title: "I find this face beautiful.",
        isRequired: true,
        rateMin: 0,
        rateMax: 6,
        minRateDescription: "Strongly disagree",
        maxRateDescription: "Strongly agree",
        displayMode: "buttons",
    },
    {
        type: "rating",
        name: "Trustworthiness",
        title: "I find this face trustworthy.",
        isRequired: true,
        rateMin: 0,
        rateMax: 6,
        minRateDescription: "Strongly disagree",
        maxRateDescription: "Strongly agree",
        displayMode: "buttons",
    },
]

var fiction_ratings1 = {
    type: jsPsychSurvey,
    survey_json: {
        goNextPageAutomatic: true,
        showQuestionNumbers: false,
        showNavigationButtons: false,
        title: function () {
            return (
                "Rating - " +
                Math.round(((fiction_trialnumber - 1) / stimuli.length) * 100) +
                "%"
            )
        },
        description: "Think of the person that you just saw. ",
        pages: [{ elements: fiction_scales1 }],
    },
    data: {
        screen: "fiction_ratings1",
    },
}

var fiction_ratings1_check = {
    type: jsPsychSurvey,
    survey_json: {
        goNextPageAutomatic: true,
        showQuestionNumbers: false,
        showNavigationButtons: false,
        title: function () {
            return (
                "Rating - " +
                Math.round(((fiction_trialnumber - 1) / stimuli.length) * 100) +
                "%"
            )
        },
        description: "Think of the person that you just saw. ",
        pages: [
            {
                elements: fiction_scales1.concat([
                    {
                        title: "What was written in the previous screen?",
                        name: "AttentionCheck",
                        type: "radiogroup",
                        choices: [
                            "AI-Generated",
                            "Photograph",
                            "I don't remember",
                        ],
                        showOtherItem: false,
                        isRequired: true,
                        colCount: 0,
                    },
                ]),
            },
        ],
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
    timeline_variables: stimuli.slice(0, 3), // <---------------------------- TODO: remove the extra slicing added for testing
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
    stimulus:
        "<div  style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
    choices: ["s"],
    trial_duration: 750,
    save_trial_parameters: { trial_duration: true },
    data: { screen: "fiction_fixation2" },
}

var fiction_showimage2 = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/" + jsPsych.evaluateTimelineVariable("Item")
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
    survey_json: {
        goNextPageAutomatic: false,
        showQuestionNumbers: false,
        showNavigationButtons: true,
        title: function () {
            return (
                "Rating - " +
                Math.round(((fiction_trialnumber - 1) / stimuli.length) * 100) +
                "%"
            )
        },
        pages: [
            {
                elements: [
                    {
                        type: "html",
                        name: "Instructions",
                        html: "The labels we showed you in the previous phase have been mixed up! Can you tell to what category each image belongs?",
                    },
                    {
                        type: "slider",
                        name: "Reality",
                        title: "I think this face is...", // "Indicate your confidence that the image is a human or AI creation"
                        description:
                            "Indicate your confidence that the image is fake or real",
                        isRequired: true,
                        // minWidth: "200%",
                        // maxWidth: "200%",
                        min: -100,
                        max: 100,
                        step: 1,
                        customLabels: [
                            {
                                value: -100,
                                text: " AI-generated",
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
        description:
            "Before we start the second phase, we wanted to know your thoughts.",
        showQuestionNumbers: false,
        elements: [
            {
                type: "checkbox",
                name: "Feedback_1",
                title: "Face Attractiveness",
                description: "Please select all that apply",
                choices: [
                    "Some faces were really attractive",
                    "No face was particularly attractive",
                    "AI-generated images were more attractive than the photos",
                    "AI-generated images were less attractive than the photos",
                ],
                showOtherItem: true,
                showSelectAllItem: false,
                showNoneItem: false,
            },
            {
                type: "checkbox",
                name: "Feedback_2",
                title: "AI-Generation Algorithm",
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
                showOtherItem: true,
                showSelectAllItem: false,
                showNoneItem: false,
            },
            {
                visibleIf:
                    "{Feedback_2} anyof ['I feel like all the images were photos']",
                title: "How certain are you that all images were photos?",
                name: "Feedback_2_ConfidenceReal",
                type: "rating",
                rateMin: 0,
                rateMax: 5,
                minRateDescription: "Not at all",
                maxRateDescription: "Completely certain",
            },
            {
                visibleIf:
                    "{Feedback_2} anyof ['I feel like all the images were AI-generated']",
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
