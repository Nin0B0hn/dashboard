"use client";

import { useState } from "react";

export default function TestInput() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', zIndex: 9999 }}>
      <h3>Test Input</h3>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter some text"
        style={{ padding: '10px', fontSize: '16px', border: '1px solid black' }}
      />
      <p>Input Value: {inputValue}</p>
    </div>
  );
}
