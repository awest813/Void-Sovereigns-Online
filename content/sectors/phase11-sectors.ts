import { Sector } from '../../shared/types/sector';

/**
 * Phase 11 sectors — The Origin Node.
 * When the Sovereign Threshold was cleared the Threshold Herald went silent.
 * Its final act was a coordinate burn — not a transmission, but a nav-system write,
 * addressed to no one and received by everyone at Farpoint simultaneously.
 * The coordinates point to a site that predates all known Architect infrastructure by centuries:
 * the place where the Null Architect recorded the first cycle entry and decided,
 * for the first time, that unknown was not acceptable.
 */
export const phase11Sectors: Sector[] = [
    {
        id: 'origin-node-sector',
        name: 'The Origin Node',
        type: 'anomaly',
        description:
            'The Herald\'s final coordinate burn arrived at the exact moment the forty-second cycle entry closed. ' +
            'No faction received it first. No faction received it last. ' +
            'The Herald Echo interface — what remains where the Herald stood — outputs one phrase on query: ' +
            '"THE ORIGIN NODE IS THE FIRST RECORD. IT HAS BEEN ACTIVE SINCE BEFORE YOU EXISTED. ' +
            'IT WILL BE ACTIVE AFTER. THIS IS NOT A WARNING. THIS IS A FACT." ' +
            'The site predates the relay network, the ghost sites, the Index Chamber, the Cycle Archive, ' +
            'and the Sovereign Threshold by centuries. ' +
            'Whatever is at the Origin Node was not built for the forty-second cycle. ' +
            'It was built for all of them.',
        dangerLevel: 'extreme',
        factions: [
            'frontier-compact',
            'helion-synod',
            'void-covenant',
            'interstellar-commonwealth-authority',
            'aegis-division',
        ],
        dungeons: ['origin-node-prime'],
        contracts: [
            'frontier-origin-node-survey',
            'synod-origin-resonance-trace',
            'covenant-origin-first-record',
            'ica-origin-node-jurisdiction',
            'aegis-origin-threat-assessment',
            'redline-origin-record-extraction',
            'redline-origin-architect-seal',
        ],
        lore: [
            'origin-node-approach-brief',
            'herald-echo-final-message',
            'synod-origin-resonance-notes',
            'ica-origin-jurisdiction-filing',
            'covenant-origin-first-record-account',
            'aegis-origin-threat-brief',
            'origin-first-cycle-log',
            'null-architect-origin-statement',
        ],
        tags: ['phase-11', 'origin-node', 'null-architect', 'void-class', 'extreme', 'endgame', 'first-record'],
    },
];
