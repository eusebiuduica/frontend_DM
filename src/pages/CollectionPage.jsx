import { useState, useEffect } from "react";
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { useSelector } from 'react-redux';

import CollectionGrid from "../components/CollectionGrid";


const CARD_WIDTH = 150;    // width of card
const CARD_HEIGHT = 300;   // height or card
const COLUMN_COUNT = 6;    // cards per row

const civilizations = [
  { label: "Any", value: 0 },

  {
    label: "Light",
    value: 1,
    img: "/resources/civilizations/Light.webp",
    width: 40,
    height: Math.round((621 / 1000) * 40),
  },

  {
    label: "Water",
    value: 2,
    img: "/resources/civilizations/Water.webp",
    width: 40,
    height: Math.round((449 / 1000) * 40),
  },

  {
    label: "Dark",
    value: 3,
    img: "/resources/civilizations/Darkness.webp",
    width: 40,
    height: Math.round((391 / 1000) * 40),
  },

  {
    label: "Fire",
    value: 4,
    img: "/resources/civilizations/Fire.webp",
    width: 40,
    height: Math.round((625 / 1000) * 40),
  },

  {
    label: "Nature",
    value: 5,
    img: "/resources/civilizations/Nature.webp",
    width: 40,
    height: Math.round((370 / 1000) * 40),
  },
];


const types = [
  { label: "Any", value: 0 },
  { label: "Creature", value: 1, img: "/resources/types/Icon_Creature16.webp" },
  { label: "Spell", value: 2, img: "/resources/types/Icon_Spell16.webp" },
  { label: "Evolution", value: 3, img: "/resources/types/Icon_Evo16.webp" },
];

const rarities = [
  { label: "Any", value: 0 },
  { label: "Common", value: 1, img: "/resources/rarities/rarity-c.webp" },
  { label: "Uncommon", value: 2, img: "/resources/rarities/rarity-u.webp" },
  { label: "Rare", value: 3, img: "/resources/rarities/rarity-r.webp" },
  { label: "Very-Rare", value: 4, img: "/resources/rarities/rarity-vr.webp" },
  { label: "Super-Rare", value: 5, img: "/resources/rarities/rarity-sr.webp" },
];

const sorts = [
  { label: "None", value: "id" },
  { label: "Cost", value: "cost" },
  { label: "Power", value: "power" },
];

const costOptions = [
  { label: "None", value: 0 },
  ...Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 })),
];

export default function CollectionPage() {
  const allCards = useSelector((state) => state.collectionDetails.cards);
  const [filteredCards, setFilteredCards] = useState([]);
  const [civilization, setCivilization] = useState(0);
  const [type, setType] = useState(0);
  const [rarity, setRarity] = useState(0);
  const [cost, setCost] = useState(0);
  const [power, setPower] = useState(1000);
  const [powerActive, setPowerActive] = useState(false);
  const [sortBy, setSortBy] = useState("id");

  useEffect(() => {
    applyFilters();
  }, [civilization, type, rarity, cost, power, powerActive, sortBy, allCards]);

  const applyFilters = () => {
    let filtered = [...allCards];

    if (civilization) filtered = filtered.filter(c => c.civilization === civilization);
    if (type) filtered = filtered.filter(c => c.type === type);
    if (rarity) filtered = filtered.filter(c => c.rarity === rarity);
    if (cost) filtered = filtered.filter(c => c.cost === Number(cost));
    if (powerActive && type !== 2) filtered = filtered.filter(c => c.power === Number(power));

    // sortare cu fallback dupa id
    filtered.sort((a, b) => {
      const key = sortBy || "id";
      if ((a[key] || 0) === (b[key] || 0)) return (a.id || 0) - (b.id || 0);
      return (a[key] || 0) - (b[key] || 0);
    });

    setFilteredCards(filtered);
  };

  const resetFilters = () => {
    setCivilization(0);
    setType(0);
    setRarity(0);
    setCost(0);
    setPower(1000);
    setPowerActive(false);
    setSortBy("id");
  };

  const filteredAndVisibleCards = filteredCards.filter(c => c.quantity + c.inPackage > 0);

  return (
    <Box display="flex" height="calc(100vh - 64px)">
    
      <Box width="70%" borderRight="1px solid #ddd" p={2}>
        
          <CollectionGrid cards = {filteredAndVisibleCards}/>

      </Box>

  
      <Box width="30%" p={3}>
        <Typography variant="h6" mb={2}>
          Filters
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Civilization</InputLabel>
            <Select value={civilization} onChange={(e) => setCivilization(e.target.value)} label="Civilization">
              {civilizations.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {c.value !== 0 && (
                      <img
                        src={c.img}
                        alt={c.label}
                        style={{ width: c.width, height: c.height }}
                      />
                    )}
                    {c.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
              {types.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {t.value !== 0 && (
                      <img
                        src={t.img}
                        alt={t.label}
                        style={{ width: 16, height: 16 }}
                      />
                    )}
                    {t.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Rarity</InputLabel>
            <Select value={rarity} onChange={(e) => setRarity(e.target.value)} label="Rarity">
              {rarities.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {r.value !== 0 && (
                      <img
                        src={r.img}
                        alt={r.label}
                        style={{ width: 16, height: 16 }}
                      />
                    )}
                    {r.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Cost</InputLabel>
            <Select value={cost} onChange={(e) => setCost(Number(e.target.value))} label="Cost">
              {costOptions.map(c => (
                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              label="Power"
              type="number"
              value={power}
              onChange={(e) => setPower(Math.max(500, Number(e.target.value)))}
              disabled={type === 2 || !powerActive}
              inputProps={{ step: 500, min: 500 }}
              sx={{ width: 120 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={powerActive}
                  onChange={(e) => setPowerActive(e.target.checked)}
                  disabled={type === 2}
                />
              }
              label="Enable Power"
            />
          </Box>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort</InputLabel>
            <Select value={sortBy || ""} onChange={(e) => setSortBy(e.target.value || null)} label="Sort">
              {sorts.map((s) => (
                <MenuItem key={s.label} value={s.value}>{s.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={resetFilters}>Reset Filters</Button>
        </Box>
      </Box>
    </Box>
  );
}