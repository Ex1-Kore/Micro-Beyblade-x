'use client';

import React, { useState, useMemo } from 'react';
import type { SystemType, BladePart, SubBladePart, RatchetPart, BitPart, Combo, ComboStats, DeckAnalysis } from './lib/types';
import { PARTS_DB } from './lib/parts-db';
import AppHeader, { type AppTab } from './components/AppHeader';
import BannerSlot from './components/BannerSlot';
import ComboBuilder from './components/ComboBuilder';
import DeckBuilder from './components/DeckBuilder';
import BeyCard from './components/BeyCard';
import PhysicsEvaluator from './components/PhysicsEvaluator';

export default function App() {
    // ── Navigation ──────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<AppTab>('builder');

    // ── Combo Selection ──────────────────────────────────────────────────────
    const [system, setSystem] = useState<SystemType>('BX');
    const [selectedBlade, setSelectedBlade] = useState<BladePart>(PARTS_DB.BX.blades[0]);
    const [selectedSubBlade, setSelectedSubBlade] = useState<SubBladePart | null>(null);
    const [selectedRatchet, setSelectedRatchet] = useState<RatchetPart>(PARTS_DB.ratchets[0]);
    const [selectedBit, setSelectedBit] = useState<BitPart>(PARTS_DB.bits[0]);

    // ── Deck (3 slots) ────────────────────────────────────────────────────────
    const [deck, setDeck] = useState<(Combo | null)[]>([null, null, null]);

    // ── Visual spin animation ─────────────────────────────────────────────────
    const [isSpinning, setIsSpinning] = useState(false);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleSystemChange = (sys: SystemType) => {
        setSystem(sys);
        if (sys === 'CX') {
            setSelectedBlade(PARTS_DB.CX.blades[0]);
            setSelectedSubBlade(PARTS_DB.CX.subblades[0]);
        } else if (sys === 'UX') {
            setSelectedBlade(PARTS_DB.UX.blades[0]);
            setSelectedSubBlade(null);
        } else {
            setSelectedBlade(PARTS_DB.BX.blades[0]);
            setSelectedSubBlade(null);
        }
    };

    const triggerSpin = () => {
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 1200);
    };

    const loadPreset = (presetName: string) => {
        const presets: Record<string, () => void> = {
            DranSword: () => { handleSystemChange('BX'); setSelectedBlade(PARTS_DB.BX.blades.find(b => b.id === 'DranSword')!); setSelectedRatchet(PARTS_DB.ratchets.find(r => r.id === '3-60')!); setSelectedBit(PARTS_DB.bits.find(b => b.id === 'F')!); },
            WizardRod: () => { handleSystemChange('UX'); setSelectedBlade(PARTS_DB.UX.blades.find(b => b.id === 'WizardRod')!); setSelectedRatchet(PARTS_DB.ratchets.find(r => r.id === '9-60')!); setSelectedBit(PARTS_DB.bits.find(b => b.id === 'B')!); },
            PhoenixWing: () => { handleSystemChange('BX'); setSelectedBlade(PARTS_DB.BX.blades.find(b => b.id === 'PhoenixWing')!); setSelectedRatchet(PARTS_DB.ratchets.find(r => r.id === '5-60')!); setSelectedBit(PARTS_DB.bits.find(b => b.id === 'P')!); },
            DranBuster: () => { handleSystemChange('UX'); setSelectedBlade(PARTS_DB.UX.blades.find(b => b.id === 'DranBuster')!); setSelectedRatchet(PARTS_DB.ratchets.find(r => r.id === '1-60')!); setSelectedBit(PARTS_DB.bits.find(b => b.id === 'A')!); },
        };
        presets[presetName]?.();
        triggerSpin();
    };

    const addToDeckSlot = (index: number) => {
        const newDeck = [...deck];
        newDeck[index] = JSON.parse(JSON.stringify(currentCombo)) as Combo;
        setDeck(newDeck);
        setActiveTab('deck');
    };

    const removeFromDeckSlot = (index: number) => {
        const newDeck = [...deck];
        newDeck[index] = null;
        setDeck(newDeck);
    };

    // ── Derived State ────────────────────────────────────────────────────────
    const currentCombo: Combo = {
        system,
        blade: selectedBlade,
        subblade: selectedSubBlade,
        ratchet: selectedRatchet,
        bit: selectedBit,
    };

    const comboStats: ComboStats = useMemo(() => {
        let totalWeight = selectedBlade.weight + selectedRatchet.weight + selectedBit.weight;
        let attack = selectedBlade.atk + selectedRatchet.atk + selectedBit.atk;
        let defense = selectedBlade.def + selectedRatchet.def + selectedBit.def;
        let stamina = selectedBlade.sta + selectedRatchet.sta + selectedBit.sta;
        let speed = selectedBit.speed;
        let burstResist = selectedRatchet.bst + selectedBit.bst;

        if (system === 'CX' && selectedSubBlade) {
            totalWeight += selectedSubBlade.weight;
            attack += selectedSubBlade.atk;
            defense += selectedSubBlade.def;
            stamina += selectedSubBlade.sta;
        }

        totalWeight = Math.round(totalWeight * 10) / 10;
        attack = Math.min(99, Math.max(10, attack));
        defense = Math.min(99, Math.max(10, defense));
        stamina = Math.min(99, Math.max(10, stamina));
        speed = Math.min(100, Math.max(10, speed));
        burstResist = Math.min(99, Math.max(10, burstResist * 2.8));

        let primaryType = selectedBit.type;
        if (attack > defense + 25 && attack > stamina + 25) primaryType = 'Attack';
        else if (defense > attack + 20 && defense > stamina) primaryType = 'Defense';
        else if (stamina > attack + 20 && stamina > defense) primaryType = 'Stamina';
        else if (Math.abs(attack - stamina) < 15 && Math.abs(defense - stamina) < 15) primaryType = 'Balance';

        const overallScore = Math.round((attack + defense + stamina + speed + burstResist + totalWeight) / 5.2);
        let tier = 'TIER B';
        if (overallScore >= 88) tier = 'TIER S+';
        else if (overallScore >= 80) tier = 'TIER S';
        else if (overallScore >= 72) tier = 'TIER A';

        let analysis = '';
        if (primaryType === 'Attack') {
            analysis = `คอมโบสายโจมตีเน้นการพุ่งด้วยความเร็วจาก Bit ${selectedBit.name} ผสานแรงชนของ ${selectedBlade.name} เหมาะกับการจั่วทำคะแนน Over Finish หรือ X-Extreme Finish`;
        } else if (primaryType === 'Stamina') {
            analysis = `คอมโบสายทนทานเน้นการคุมพื้นที่ตรงกลางสนาม Blade ${selectedBlade.name} (inertia ×${selectedBlade.inertiaFactor}) ช่วยให้ Angular Momentum สูง หมุนได้นาน`;
        } else if (primaryType === 'Defense') {
            analysis = `คอมโบสายป้องกัน ปักหลักซับแรง Bit ${selectedBit.name} สร้าง τ ต่ำ ทำให้ L รักษาได้ดีหลังถูกชน`;
        } else {
            analysis = `คอมโบสายสมดุล ยืดหยุ่นสูง สามารถปรับจังหวะวิ่งตามองศาชู้ต มีทั้งความเร็วพุ่งชนและความนิ่งในการหมุนช่วงท้าย`;
        }

        return { totalWeight, attack, defense, stamina, speed, burstResist, primaryType, overallScore, tier, analysis };
    }, [selectedBlade, selectedSubBlade, selectedRatchet, selectedBit, system]);

    const deckAnalysis: DeckAnalysis = useMemo(() => {
        const usedParts: string[] = [];
        let hasDuplicates = false;
        let totalDeckWeight = 0;
        const typeCounts: Record<string, number> = {};

        deck.forEach(slot => {
            if (!slot) return;
            let w = slot.blade.weight + slot.ratchet.weight + slot.bit.weight;
            if (slot.subblade) w += slot.subblade.weight;
            totalDeckWeight += w;

            [slot.blade.name, slot.ratchet.name, slot.bit.id].forEach(part => {
                if (usedParts.includes(part)) hasDuplicates = true;
                else usedParts.push(part);
            });

            typeCounts[slot.bit.type] = (typeCounts[slot.bit.type] || 0) + 1;
        });

        const filledSlots = deck.filter(s => s !== null).length;
        const uniqueTypesCount = Object.keys(typeCounts).length;
        const coverage = Math.round((uniqueTypesCount / 4) * 100);
        let dominantType = '-';
        let maxC = 0;
        for (const t in typeCounts) { if (typeCounts[t] > maxC) { maxC = typeCounts[t]; dominantType = t; } }
        const balanceScore = filledSlots * 25 + (hasDuplicates ? 0 : 25);

        return { hasDuplicates, totalDeckWeight: Math.round(totalDeckWeight * 10) / 10, filledSlots, coverage, dominantType, balanceScore };
    }, [deck]);

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
            <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

            <BannerSlot position="top" className="max-w-7xl mx-auto px-4 md:px-8 pt-6" />

            <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">

                {/* Left / Main Section */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    {activeTab === 'builder' && (
                        <ComboBuilder
                            system={system}
                            selectedBlade={selectedBlade}
                            selectedSubBlade={selectedSubBlade}
                            selectedRatchet={selectedRatchet}
                            selectedBit={selectedBit}
                            onSystemChange={handleSystemChange}
                            onBladeChange={setSelectedBlade}
                            onSubBladeChange={setSelectedSubBlade}
                            onRatchetChange={setSelectedRatchet}
                            onBitChange={setSelectedBit}
                            onLoadPreset={loadPreset}
                            onAddToDeckSlot={addToDeckSlot}
                        />
                    )}
                    {activeTab === 'deck' && (
                        <DeckBuilder
                            deck={deck}
                            deckAnalysis={deckAnalysis}
                            onRemoveSlot={removeFromDeckSlot}
                            onGoToBuilder={() => setActiveTab('builder')}
                        />
                    )}
                    {activeTab === 'physics' && (
                        <PhysicsEvaluator currentCombo={currentCombo} />
                    )}
                </div>

                {/* Right Section — BeyCard always visible */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <BeyCard
                        system={system}
                        selectedBlade={selectedBlade}
                        selectedRatchet={selectedRatchet}
                        selectedBit={selectedBit}
                        comboStats={comboStats}
                        isSpinning={isSpinning}
                        onSpin={triggerSpin}
                    />
                </div>

            </main>

            <footer className="border-t border-slate-800/50 py-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-center text-xs text-slate-500 shadow-xl shadow-slate-950/50">
                <p className="font-semibold tracking-wide">Beyblade X Combo &amp; Physics Simulator • BX / UX / CX (Takara Tomy Standard)</p>
                <p className="text-slate-600 mt-2">Crafted with precision for competitive Beybladers</p>
            </footer>
        </div>
    );
}
