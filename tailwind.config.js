/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: '#FF5A5F',
                secondary: '#00A699',
                airbnb: {
                    red: '#FF5A5F',
                    black: '#222222',
                    hof: '#484848',
                    foggy: '#767676',
                    lightGrey: '#EBEBEB',
                    bg: '#F7F7F7',
                },
                viral: {
                    gradientStart: '#FF5A5F',
                    gradientEnd: '#FF385C',
                }
            }
        },
    },
    plugins: [],
}
