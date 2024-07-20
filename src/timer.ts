import { TimerState } from "./consts";

export class Timer {
    private timerState: TimerState = "Idle";
    private timeRemaining: number = 0;
    private intervalId: NodeJS.Timeout | undefined;
    private cycleCount: number = 0;

    private workDuration: number = 25 * 60; // 25分
    private shortBreakDuration: number = 5 * 60; // 5分
    private longBreakDuration: number = 15 * 60; // 15分
    private cyclesBeforeLongBreak: number = 4; // 4インターバル
    private handleStateChanged: (state: TimerState) => void;
    private updateStatusBar: (text: string) => void;

    constructor(
        settings: {
            workDuration: number;
            shortBreakDuration: number;
            longBreakDuration: number;
            cyclesBeforeLongBreak: number;
        },
        handleStateChanged: (state: TimerState) => void,
        updateStatusBar: (text: string) => void,
    ) {
        this.workDuration = settings.workDuration;
        this.shortBreakDuration = settings.shortBreakDuration;
        this.longBreakDuration = settings.longBreakDuration;
        this.cyclesBeforeLongBreak = settings.cyclesBeforeLongBreak;
        this.handleStateChanged = handleStateChanged;
        this.updateStatusBar = updateStatusBar;
    }

    public getTimerState(): typeof this.timerState {
        return this.timerState;
    }

    public getTimeRemaining(): typeof this.timeRemaining {
        return this.timeRemaining;
    }

    public getIntervalId(): typeof this.intervalId {
        return this.intervalId;
    }

    public getCycleCount(): typeof this.cycleCount {
        return this.cycleCount;
    }

    public start() {
        if (this.timerState === "Idle") {
            this.timerState = "Work";
            this.timeRemaining = this.workDuration;
            this.updateStatusBar(this.getStatusBarText());
            this.intervalId = setInterval(
                () => this.update(),
                1000,
            );
        }
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
        this.timerState = "Idle";
        this.timeRemaining = 0;
        this.cycleCount = 0;
        this.updateStatusBar(this.getStatusBarText());
    }

    private update() {
        if (this.timeRemaining > 0) {
            this.timeRemaining--;
            this.updateStatusBar(this.getStatusBarText());
        } else {
            this.switchTimerState();
        }
    }

    private switchTimerState() {
        switch (this.timerState) {
            case "Work":
                this.cycleCount++;
                if (this.cycleCount % this.cyclesBeforeLongBreak === 0) {
                    this.timerState = "LongBreak";
                    this.timeRemaining = this.longBreakDuration;
                } else {
                    this.timerState = "ShortBreak";
                    this.timeRemaining = this.shortBreakDuration;
                }
                break;
            case "ShortBreak":
            case "LongBreak":
                this.timerState = "Work";
                this.timeRemaining = this.workDuration;
                break;
        }
        this.updateStatusBar(this.getStatusBarText());
        this.handleStateChanged(this.timerState);
    }

    private getMinute(): number {
        return Math.floor(this.timeRemaining / 60);
    }

    private getSeconds(): number {
        return this.timeRemaining % 60;
    }

    private getStatusBarText(): string {
        return `🍅 ${this.getMinute()}:${
            this.getSeconds().toString().padStart(2, "0")
        }`;
    }
}
