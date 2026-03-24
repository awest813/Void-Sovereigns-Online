import { Sector } from '../../shared/types/sector';

export const meridianStation: Sector = {
    id: 'meridian-station',
    name: 'Meridian Station',
    type: 'station',
    description:
        'A massive converted mining station that once served as a premier trade hub for this region of space. ' +
        'The nearby Void Relays have gone dark or become unreliable over the last two decades, ' +
        'cutting Meridian off from core-world traffic. ' +
        'Now it survives as a low-rent outpost for drifters, scavengers, haulers, and stranded people ' +
        'who cannot afford to go anywhere else. ' +
        'It is busy, grimy, and somehow still running.',
    dangerLevel: 'safe',
    factions: [
        'meridian-dock-authority',
        'ashwake-extraction-guild',
        'free-transit-compact',
        'void-covenant',
    ],
    dungeons: [],
    contracts: [
        'delivery-fuel-cells-ashwake',
        'bounty-rogue-drone-mk3',
        'salvage-rig-alpha-7',
    ],
    lore: [
        'history-meridian-decline',
        'lore-void-relays-overview',
    ],
    tags: ['hub', 'station', 'starter', 'safe-zone'],
};
