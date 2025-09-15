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

// Variables ===================================================================
var fiction_trialnumber = 1
var color_cues = shuffleArray(["red", "blue", "green"])
color_cues = { Reality: color_cues[0], Fiction: color_cues[1] }
var text_cue = { Reality: "Photograph", Fiction: "AI-generated" }
stimuli = assignCondition(stimuli)
