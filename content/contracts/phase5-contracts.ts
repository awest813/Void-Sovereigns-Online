import { Contract } from '../../shared/types/contract';

/**
 * Phase 5 contracts — Redline Runs and high-stakes frontier work.
 * Vault of the Broken Signal (Vanta Corsairs, Frontier Compact)
 * Ashveil Observation Post (Aegis Division, Helion Synod)
 * First full implementation of extraction risk and loss mechanics.
 */
export const phase5Contracts: Contract[] = [

    // ── STANDARD PHASE 5 CONTRACTS ────────────────────────────────────────

    {
        id: 'vanta-vault-intel-run',
        title: 'Off-Book: Vault Survey — Broken Signal Site',
        category: 'investigation',
        tier: 4,
        factionId: 'vanta-corsairs',
        description:
            'Crow Veslin found coordinates for an unregistered industrial facility in the Kalindra Drift outer zone ' +
            'buried in the unlogged freight manifest you brought back. ' +
            '"It\'s been broadcasting," Crow says. "Continuously. Someone was receiving those broadcasts, ' +
            'which means someone knows it\'s there and has been choosing not to tell anyone." ' +
            'Crow wants preliminary intelligence on the facility before committing to a full retrieval operation. ' +
            '"Go in. Look around. Don\'t get killed. Tell me what\'s in there." ' +
            'Standard Vanta contract framing: the job sounds smaller than it is.',
        giver: 'crow-veslin',
        sector: 'kalindra-drift',
        reputationRequirement: { factionId: 'vanta-corsairs', minRep: 15 },
        objectives: [
            'Transit to the Kalindra Drift outer zone.',
            'Locate and access the unregistered Vault facility.',
            'Recover a cargo sample and facility manifest data.',
            'Return intelligence to Crow Veslin at Meridian.',
        ],
        reward: {
            credits: 2200,
            xp: 980,
            reputationGain: {
                'vanta-corsairs': 25,
                'aegis-division': -10,
            },
            itemRewards: ['vault-encoded-manifest'],
        },
        tags: ['investigation', 'gray-market', 'vanta', 'phase-5', 'post-relay', 'redline-adjacent'],
    },

    {
        id: 'helion-contaminated-survey',
        title: 'Synod: Contaminated Zone Assessment — Ashveil Corridor',
        category: 'survey',
        tier: 4,
        factionId: 'helion-synod',
        description:
            'Aris Vel has been tracking a persistent void-resonance signal from the Ashveil corridor ' +
            'for eleven months. The signal has been strengthening. ' +
            '"There is a post at the edge of that corridor," she says. "The Ashveil Observation Post. ' +
            'Our people built it. We sent crew. We received reports. Then the reports kept arriving after the crew stopped." ' +
            'She pauses. "I need someone to tell me what is in there. ' +
            'I need a field assessment before I can justify sending a research team." ' +
            '"And if it turns out a research team cannot survive it?" ' +
            '"Then I need to know that too."',
        giver: 'aris-vel',
        sector: 'ashveil-observation-post',
        objectives: [
            'Transit to the Ashveil corridor grid node.',
            'Conduct approach assessment of the Observation Post exterior.',
            'File a preliminary void-resonance reading.',
            'Return assessment data to Aris Vel.',
        ],
        reward: {
            credits: 1850,
            xp: 880,
            reputationGain: {
                'helion-synod': 28,
                'void-covenant': 12,
            },
            itemRewards: ['helion-research-data'],
        },
        tags: ['survey', 'helion', 'anomaly', 'phase-5', 'post-relay', 'void-adjacent'],
    },

    // ── REDLINE CONTRACTS ─────────────────────────────────────────────────

    {
        id: 'redline-vault-broken-signal',
        title: 'REDLINE: Vault Extraction — Broken Signal Coordinator Node',
        category: 'extraction',
        tier: 4,
        factionId: 'vanta-corsairs',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The Vault of the Broken Signal has active hostile units ' +
            'and an operational Overseer unit classified as lethal-response grade. ' +
            'If you are killed or forced to emergency-extract, you will lose most equipped field consumables. ' +
            'Your ship returns on autopilot. Your gear does not. ' +
            'Use the secure slot to protect your most critical item before entering. ' +
            'This contract pays four times standard rate. The Overseer is real. Go prepared.',
        reputationRequirement: { factionId: 'vanta-corsairs', minRep: 50 },
        description:
            'Crow Veslin has a buyer. The buyer wants the Vault\'s coordination node — ' +
            'the primary signal management unit Crow is calling the "Overseer." ' +
            '"The node itself is not the objective," Crow says. "The transmission log inside it is. ' +
            'Forty months of incoming messages from a source that does not exist on any registered frequency. ' +
            'My buyer believes that log tells you where those messages originated." ' +
            'Crow does not say who the buyer is. Crow never does. ' +
            'The contract slip has a red line down the margin. ' +
            '"The Overseer unit is active," Crow adds. "It is not a standard overseer."',
        giver: 'crow-veslin',
        sector: 'kalindra-drift',
        objectives: [
            'Transit to the Vault of the Broken Signal with full field equipment.',
            'Reach the Coordinator Core.',
            'Defeat the Vault Overseer and recover the Broken Signal Core.',
            'Recover the Vault Encoded Manifest from cold storage.',
            'Extract alive.',
            'Return findings to Crow Veslin.',
        ],
        reward: {
            credits: 5200,
            xp: 2200,
            reputationGain: {
                'vanta-corsairs': 50,
                'frontier-compact': -12,
                'aegis-division': -18,
                'void-covenant': 20,
            },
            itemRewards: ['broken-signal-core', 'vault-encoded-manifest', 'restricted-nav-module'],
        },
        tags: ['extraction', 'redline', 'vanta', 'vault', 'tier-4', 'phase-5', 'post-relay', 'high-risk'],
    },

    {
        id: 'frontier-ghost-box-extraction',
        title: 'REDLINE: Ghost-Signal Black Box — Vault of the Broken Signal',
        category: 'extraction',
        tier: 4,
        factionId: 'frontier-compact',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. The Vault facility is classified lethal-access by the Frontier Compact ' +
            'following preliminary intelligence from your previous reconnaissance. ' +
            'Casualties are expected. If you are killed before extraction, field consumables are lost. ' +
            'The secure slot will protect one item. Insurance can be purchased at Services. ' +
            'The Compact is offering triple rate plus a restricted navigation module on full extraction. ' +
            'Leva says: "This job exists because it is the kind of job a person only does once. ' +
            'Make it count."',
        reputationRequirement: { factionId: 'frontier-compact', minRep: 60 },
        description:
            'Frontier Agent Leva has reviewed the Vault intelligence and reached the same conclusion as Crow\'s buyer: ' +
            'the coordination node\'s transmission log is the most important undiscovered document ' +
            'in the post-relay frontier. ' +
            '"The Compact needs that signal archive before the Vanta move on it," she says. ' +
            '"Not because we are in competition. Because if the transmission origin is what I think it is, ' +
            'the Compact needs to know before anyone who would restrict that information." ' +
            'She slides the contract across. The line down the margin is not ink.',
        giver: 'frontier-agent-leva',
        sector: 'kalindra-drift',
        objectives: [
            'Transit to the Vault of the Broken Signal with full field equipment.',
            'Reach the Coordinator Core.',
            'Defeat the Vault Overseer.',
            'Recover the Broken Signal Core transmission archive.',
            'Extract alive.',
            'Return to Frontier Agent Leva.',
        ],
        reward: {
            credits: 4800,
            xp: 2000,
            reputationGain: {
                'frontier-compact': 55,
                'vanta-corsairs': -15,
                'void-covenant': 22,
            },
            itemRewards: ['broken-signal-core', 'restricted-nav-module'],
        },
        tags: ['extraction', 'redline', 'frontier-compact', 'vault', 'tier-4', 'phase-5', 'post-relay', 'high-risk'],
    },

    {
        id: 'redline-ashveil-data-extraction',
        title: 'REDLINE: Black-Site Data Extraction — Ashveil Observation Post',
        category: 'extraction',
        tier: 5,
        factionId: 'aegis-division',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. Ashveil Observation Post is the highest-threat site currently ' +
            'designated in Aegis field operations. The Terminal Prime unit is classified lethal-autonomous — ' +
            'it will kill you. If you die before extraction, all field consumables are lost. ' +
            'Insurance is strongly recommended. Use the secure slot. ' +
            'This contract is Tier 5. The payout reflects that. ' +
            'Operative Sable says: "Understand what you are walking into. ' +
            'I am not sending you into this site because it is winnable. ' +
            'I am sending you because someone who knows the risk has to go."',
        reputationRequirement: { factionId: 'aegis-division', minRep: 60 },
        description:
            'Operative Sable has identified the Ashveil Observation Post as the source of ' +
            'the most complete void relay anomaly record currently in existence. ' +
            '"Twenty-three months of continuous monitoring," she says. "After the crew died." ' +
            'She does not elaborate on the crew. ' +
            '"The Terminal Prime unit has been running the post in their absence. ' +
            'It has been filing reports. It has been maintaining equipment. ' +
            'And it has been receiving transmissions that our relay intercepts cannot explain." ' +
            'A long pause. "The observation log is in there. I need it. ' +
            'I need the void fragment sample the crew prepared before they stopped being able to prepare things. ' +
            'And I need to know what the Terminal Prime has been responding to." ' +
            'The contract slip hits the table. Red line, corner to corner.',
        giver: 'operative-sable',
        sector: 'ashveil-observation-post',
        objectives: [
            'Transit to the Ashveil Observation Post with full field equipment.',
            'Recover the Synod void fragment sample from the sensor archive.',
            'Reach the Observation Core.',
            'Defeat the Ashveil Terminal Prime.',
            'Recover the complete Ashveil Observation Log.',
            'Extract alive.',
            'Return all findings to Operative Sable.',
        ],
        reward: {
            credits: 6500,
            xp: 2800,
            reputationGain: {
                'aegis-division': 65,
                'void-covenant': 30,
                'helion-synod': 15,
                'sol-union-directorate': 10,
            },
            itemRewards: ['ashveil-observation-log', 'void-fragment-sample', 'restricted-nav-module'],
        },
        tags: ['extraction', 'redline', 'aegis', 'ashveil', 'anomaly', 'tier-5', 'phase-5', 'post-relay', 'high-risk', 'void-adjacent'],
    },

    {
        id: 'redline-helion-anomaly-sample',
        title: 'REDLINE: Anomaly Sample Recovery — Ashveil Post Containment',
        category: 'extraction',
        tier: 5,
        factionId: 'helion-synod',
        isRedline: true,
        redlineWarning:
            'This is a REDLINE contract. Ashveil Observation Post is active hostile territory. ' +
            'The void-resonance emitters inside the post generate field interference that affects ' +
            'equipment, cognition, and threat perception. If you die before extraction, ' +
            'field consumables are lost. Use the secure slot for your anomaly field kit. ' +
            '"The sample container was prepared by my crew," Aris Vel says. ' +
            '"They died after they prepared it. I need it. ' +
            'What that tells you about the risk level is something you should take seriously."',
        reputationRequirement: { factionId: 'helion-synod', minRep: 55 },
        description:
            'Aris Vel needs the void fragment sample her research team prepared in the Ashveil Post ' +
            'before they stopped sending communications. ' +
            '"The sample was properly packaged," she says. "The containment case was labeled for transfer. ' +
            'They were ready to send it. They ran out of time to send it." ' +
            'A pause. "I have been waiting eleven months for someone prepared to go in and get it. ' +
            'You are the first operator I have spoken to who is both willing and likely to survive." ' +
            'She hands you an anomaly field kit. ' +
            '"From our reserve. It will help with the resonance exposure. ' +
            'The void resonance emitters are active. Do not let them run uncontested."',
        giver: 'aris-vel',
        sector: 'ashveil-observation-post',
        objectives: [
            'Transit to the Ashveil Observation Post with full field equipment.',
            'Locate the sensor archive room.',
            'Recover the prepared void fragment sample from the containment case.',
            'Neutralize the void resonance emitters.',
            'Extract alive.',
            'Return the void fragment sample to Aris Vel.',
        ],
        reward: {
            credits: 5800,
            xp: 2500,
            reputationGain: {
                'helion-synod': 60,
                'void-covenant': 25,
                'aegis-division': 15,
            },
            itemRewards: ['void-fragment-sample', 'ashveil-observation-log', 'helion-research-data'],
        },
        tags: ['extraction', 'redline', 'helion', 'ashveil', 'anomaly', 'tier-5', 'phase-5', 'post-relay', 'high-risk', 'void-adjacent'],
    },

    {
        id: 'aegis-black-site-breach',
        title: 'Aegis: Black-Site Survey — Ashveil Post Exterior Assessment',
        category: 'investigation',
        tier: 4,
        factionId: 'aegis-division',
        description:
            'Operative Sable needs a verified exterior assessment of Ashveil Observation Post ' +
            'before authorizing a full extraction operation. ' +
            '"I need confirmation that the post is still intact, still active, ' +
            'and that the Terminal Prime unit is still functioning in a way that suggests ' +
            'the interior records are recoverable," she says. ' +
            '"I also need a reading on the void resonance emitter output from the exterior. ' +
            'The readings I have are eleven months old." ' +
            'She looks at you. ' +
            '"If you come back with data suggesting the site is inoperable, ' +
            'I will not send you in for the full extraction. If you come back saying it is survivable, ' +
            'I will. That distinction is in your hands."',
        giver: 'operative-sable',
        sector: 'ashveil-observation-post',
        reputationRequirement: { factionId: 'aegis-division', minRep: 40 },
        objectives: [
            'Transit to the Ashveil Observation Post grid node.',
            'Conduct exterior assessment of the post structure and emitter output.',
            'Reach the sensor archive and recover preliminary data.',
            'Return assessment to Operative Sable.',
        ],
        reward: {
            credits: 2400,
            xp: 1100,
            reputationGain: {
                'aegis-division': 35,
                'helion-synod': 10,
                'void-covenant': 12,
            },
            itemRewards: ['ashveil-observation-log'],
        },
        tags: ['investigation', 'aegis', 'ashveil', 'anomaly', 'tier-4', 'phase-5', 'post-relay', 'void-adjacent'],
    },
];
