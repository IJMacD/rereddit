import React from 'react';
import * as Diff from 'diff';

export function DiffViewer ({ left, right }) {
    if (!left || !right) return null;

    const diff = Diff.diffChars(left, right);

    return (
        <div className="PreviewBox">
        {
            diff.map((chunk, i) => <span key={i} style={chunkStyle(chunk)}>{chunk.value}</span>)
        }
        </div>
    );
}

function chunkStyle (chunk) {
    return {
        color: chunk.added ? "#00C000" : (chunk.removed ? "#F33" : ""),
        backgroundColor: chunk.added ? "#DFD" : (chunk.removed ? "#FDD" : "transparent"),
    }
}