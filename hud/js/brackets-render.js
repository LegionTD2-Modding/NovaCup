import React, { useEffect } from 'react';

const DATA_URL = '../data/db-brackets.json';

async function render() {
    const data = await fetch(DATA_URL).then(res => res.json());

    window.bracketsViewer.render({
        stages: data.stage,
        matches: data.match,
        matchGames: data.match_game,
        participants: data.participant,
    });
}

function BracketsRender() {
    useEffect(() => {
        render();
    }, []);

    return <div className="brackets-viewer"></div>
}

export default BracketsRender;
