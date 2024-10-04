import { useState } from 'react';
import { Label } from '@/components/ui/label'; // Label-Komponente aus shadcn importieren

const ColorPicker = () => {
    const [hexColor, setHexColor] = useState('#FFFFFF'); // Standardfarbe Weiß

    const changeColor = (color: string) => {
        if (window.unityInstance) {
            window.unityInstance.SendMessage('Cube', 'ChangeColor', color); // Nachricht an Unity senden
        }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setHexColor(color);
        changeColor(color); // Farbe nach Auswahl senden
    };

    return (
        <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="color">Color</Label> {/* Hier das Label korrekt verwenden */}
            {/* Farbpicker */}
            <div className="col-span-2 h-8 flex items-center gap-2">
                <input
                    type="color"
                    id="color"
                    value={hexColor}
                    onChange={handleColorChange}
                    className="bg-transparent border-none h-8 w-8 cursor-pointe " // Verwende Tailwind-Klassen für das Styling
                />
                <p className="text-sm">{hexColor}</p> {/* Zeigt die ausgewählte Farbe an */}
            </div>
        </div>
    );
};

export default ColorPicker;
