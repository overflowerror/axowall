
declare global {
    interface Uint8Array {
        toHex(): string;
        hasPrefix(prefix: Uint8Array, bits: number): boolean;
    }
}

Uint8Array.prototype.toHex = function(): string {
    return [...this].map(c => (c >> 4).toString(16) + (c & 15).toString(16)).join("");
};

Uint8Array.prototype.hasPrefix = function(prefix: Uint8Array, bits: number): boolean {
    for(let i = 0; i < prefix.length && i * 8 < bits; i++) {
        const bitsForByte = Math.min(8, bits - i * 8);
        const bitMask = ((1 << bitsForByte) - 1) << (8 - bitsForByte);
        const currentBits = this[i] & bitMask;
        const prefixBits = prefix[i] & bitMask;

        if (currentBits != prefixBits) {
            return false;
        }
    }
    return true;
};

export const digest = async (algo: AlgorithmIdentifier, input: string): Promise<Uint8Array> =>
    new Uint8Array(await crypto.subtle.digest(algo, new TextEncoder().encode(input)));
