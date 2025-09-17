// Condition assignment ============================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

// Condition assignment ============================================
function assignCondition(stimuli) {
    new_stimuli_list = []
    // Loop through unique categories
    for (let cat of [...new Set(stimuli.map((a) => a.Category))]) {
        // Get all stimuli of this category
        var cat_stimuli = stimuli.filter((a) => a.Category == cat)

        // Shuffle cat_stimuli
        cat_stimuli = shuffleArray(cat_stimuli) // Custom funciton defined above

        // Assign half to "Reality" condition and half to "Fiction" condition
        for (let i = 0; i < cat_stimuli.length; i++) {
            cat_stimuli[i].Condition =
                i < cat_stimuli.length / 2 ? "Reality" : "Fiction"
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
// stimuli = assignCondition(stimuli)

// We make 6 catch trials (always starting from 2 = the first trial)
// catch_trials = [2].concat(generateRandomNumbers(3, stimuli_list.length, 5))

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
   For this, we will be using a new <b>image-generation algorithm</b> (based on a modified <i>Generative Adversarial Network</i>) trained on large dataset of images from the <b style="color: #e70ae7ff">Face Research Lab London Database</b> (DeBruine & Jones, 2017).</p>
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
    </div>
`,
                    },
                ],
            },
        ],
    },
}
