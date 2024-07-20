export const TimerStateList = [
    "Idle",
    "Work",
    "ShortBreak",
    "LongBreak",
] as const;

export type TimerState = typeof TimerStateList[number];
