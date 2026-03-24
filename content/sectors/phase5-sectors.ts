import { Sector } from '../../shared/types/sector';

/**
 * Phase 5 sectors — Redline-designated locations beyond the standard frontier.
 * The Vault of the Broken Signal (industrial/practical) and
 * Ashveil Observation Post (eerie/anomaly-linked) serve as the first true
 * high-risk extraction sites.
 */
export const phase5Sectors: Sector[] = [
    {
        id: 'vault-broken-signal-zone',
        name: 'Vault of the Broken Signal',
        type: 'ruins',
        description:
            'An unregistered industrial facility deep in the Kalindra Drift outer zone. ' +
            'Not on any Frontier Compact salvage manifest. Not on any Aegis classification notice. ' +
            'Crow Veslin located it in recovered unlogged freight data. ' +
            'It has been broadcasting continuously on an unregistered frequency for forty months. ' +
            'The broadcast stopped the moment an approach vessel appeared on its sensors.',
        dangerLevel: 'extreme',
        factions: ['vanta-corsairs', 'frontier-compact', 'aegis-division'],
        dungeons: ['vault-of-the-broken-signal'],
        contracts: [
            'vanta-vault-intel-run',
            'redline-vault-broken-signal',
            'frontier-ghost-box-extraction',
        ],
        lore: ['vault-transmission-excerpt', 'vanta-after-action-note'],
        tags: ['industrial', 'redline', 'vault', 'broadcasting', 'phase-5', 'high-risk'],
    },
    {
        id: 'ashveil-observation-zone',
        name: 'Ashveil Observation Post',
        type: 'ruins',
        description:
            'A Helion Synod monitoring installation at the edge of the 7-9 relay corridor. ' +
            'The crew filed regular reports for eight months after the relay network collapsed. ' +
            'Then the reports continued without them. ' +
            'The post is still active, still recording, and still responding to Synod communication formats — ' +
            'in the voices of staff members who have been dead for twenty-three months.',
        dangerLevel: 'extreme',
        factions: ['helion-synod', 'aegis-division', 'void-covenant'],
        dungeons: ['ashveil-observation-post'],
        contracts: [
            'helion-contaminated-survey',
            'redline-ashveil-data-extraction',
            'redline-helion-anomaly-sample',
            'aegis-black-site-breach',
        ],
        lore: ['ashveil-final-crew-log', 'helion-synod-pattern-analysis'],
        tags: ['anomaly', 'redline', 'eerie', 'void-adjacent', 'synod', 'phase-5', 'high-risk'],
    },
];
