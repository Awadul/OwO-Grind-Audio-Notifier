export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export function jitter(min: number, max: number): number {
    let additionalWait = Math.random() * (max - min) + min;
    return additionalWait;
}