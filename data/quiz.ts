export interface Question {
    id: number;
    text: string;
    options: {
        text: string;
        style: 'secure' | 'anxious' | 'dismissive' | 'fearful';
    }[];
}

export const QUIZ_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "When your partner doesn't text back for a few hours, you typically feel...",
        options: [
            { text: "Fine, they're probably busy.", style: "secure" },
            { text: "Panicked. Did I say something wrong?", style: "anxious" },
            { text: "Annoyed. I don't need them anyway.", style: "dismissive" },
            { text: "Worried, but I won't double text.", style: "fearful" }
        ]
    },
    {
        id: 2,
        text: "In arguments, your instinct is to...",
        options: [
            { text: "Talk it out calmly.", style: "secure" },
            { text: "Keep pushing until it's resolved.", style: "anxious" },
            { text: "Shut down or walk away.", style: "dismissive" },
            { text: "Explode, then regret it.", style: "fearful" }
        ]
    },
    {
        id: 3,
        text: "When a relationship starts getting serious, you feel...",
        options: [
            { text: "Excited and comfortable.", style: "secure" },
            { text: "Afraid they'll leave me.", style: "anxious" },
            { text: "Suffocated. I need space.", style: "dismissive" },
            { text: "Conflicted. I want it but I'm scared.", style: "fearful" }
        ]
    },
    {
        id: 4,
        text: "You express affection...",
        options: [
            { text: "Freely and consistently.", style: "secure" },
            { text: "Constantly, to be sure they love me.", style: "anxious" },
            { text: "Rarely. It feels uncomfortable.", style: "dismissive" },
            { text: "Hot and cold.", style: "fearful" }
        ]
    },
    {
        id: 5,
        text: "Your view on independence is...",
        options: [
            { text: "Important for both of us.", style: "secure" },
            { text: "Scary. We should do everything together.", style: "anxious" },
            { text: "The most important thing. I rely on myself.", style: "dismissive" },
            { text: "I want it, but I end up dependent.", style: "fearful" }
        ]
    },
    {
        id: 6,
        text: "If a partner wants more space, you...",
        options: [
            { text: "Respect it.", style: "secure" },
            { text: "Feel rejected and cling tighter.", style: "anxious" },
            { text: "Relieved. Finally.", style: "dismissive" },
            { text: "Assume it's over.", style: "fearful" }
        ]
    },
    {
        id: 7,
        text: "Dealing with emotions...",
        options: [
            { text: "I can share them openly.", style: "secure" },
            { text: "I'm overwhelmed by them.", style: "anxious" },
            { text: "I prefer to keep them to myself.", style: "dismissive" },
            { text: "They are confusing and intense.", style: "fearful" }
        ]
    },
    {
        id: 8,
        text: "Past relationships have mostly ended because...",
        options: [
            { text: "We grew apart naturally.", style: "secure" },
            { text: "I was 'too much' or 'too needy'.", style: "anxious" },
            { text: "They got too close/clingy.", style: "dismissive" },
            { text: "It was a chaotic rollercoaster.", style: "fearful" }
        ]
    },
    {
        id: 9,
        text: "When you need help, you...",
        options: [
            { text: "Ask for it comfortably.", style: "secure" },
            { text: "Desperately rely on others.", style: "anxious" },
            { text: "Figure it out alone. Always.", style: "dismissive" },
            { text: "Don't trust anyone to help right.", style: "fearful" }
        ]
    },
    {
        id: 10,
        text: "Ideally, a relationship is...",
        options: [
            { text: "A partnership of equals.", style: "secure" },
            { text: "My whole world.", style: "anxious" },
            { text: "A nice addition, but not essential.", style: "dismissive" },
            { text: "Something I crave but fear.", style: "fearful" }
        ]
    }
];

export const calculateResult = (answers: ('secure' | 'anxious' | 'dismissive' | 'fearful')[]) => {
    const counts = { secure: 0, anxious: 0, dismissive: 0, fearful: 0 };
    answers.forEach(a => counts[a]++);

    // Find highest count
    let maxStyle = 'secure';
    let maxCount = 0;

    Object.entries(counts).forEach(([style, count]) => {
        if (count > maxCount) {
            maxCount = count;
            maxStyle = style;
        }
    });

    return maxStyle;
};
