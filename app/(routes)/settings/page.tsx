
export default async function Settings() {

  return (
    <div>
      1
      {/* 1. Centrowanie idealne (Vertical & Horizontal)
          Najszybszy sposób, żeby umieścić element dokładnie na środku rodzica. */}
      <div className="flex items-center justify-center h-64 bg-slate-100">
        <div className="bg-blue-500 p-10 text-white">Środek</div>
      </div>

      2
      {/* 2. Pasek nawigacji (Logo --- Menu)
      Użycie justify-between odpycha elementy od siebie na maksymalną odległość. */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="font-bold">LOGO</div>
        <div className="flex gap-4">
          <span>Home</span>
          <span>About</span>
        </div>
      </div>

      3
      {/* 3. Sticky Footer (Popychanie stopki)
      Dzięki flex-col i mt-auto, stopka zawsze będzie na dole, nawet jeśli treści jest mało. */}
    <div className="flex flex-col h-64 border">
      <div className="p-4 bg-green-100">Treść główna</div>
      <div className="mt-auto p-4 bg-green-500 text-white">Stopka na samym dole</div>
    </div>

    4
    {/* 4. Nierówne kolumny (Pasek boczny) */}
    <div className="flex h-40">
      <div className="w-20 bg-indigo-500 text-white">Sidebar</div>
      <div className="flex-1 bg-indigo-100">Główny panel (elastyczny)</div>
    </div>

      5 Gdy elementy nie mieszczą się w rzędzie, przeskakują do nowej linii.
      {/* 5. Flex Wrap (Karty zadań) 
      Gdy elementy nie mieszczą się w rzędzie, przeskakują do nowej linii.*/}
      <div className="flex flex-wrap gap-4 p-4 border">
        <div className="w-32 h-20 bg-pink-300">Karta 1</div>
        <div className="w-32 h-20 bg-pink-300">Karta 2</div>
        <div className="w-32 h-20 bg-pink-300">Karta 3</div>
        <div className="w-32 h-20 bg-pink-300">Karta 4</div>
      </div>

        6. Wyrównywanie "do dołu" - lini tekstu (Baseline)
        <div className="flex items-baseline gap-4 p-4 bg-yellow-50">
          <span className="text-4xl">Duży</span>
          <span className="text-sm">mały</span>
        </div>

        7. Proporcje (flex-2 vs flex-1)
        <div className="flex gap-2">
          <div className="flex-2 bg-orange-400 p-4">Zajmuję 2/3</div>
          <div className="flex-1 bg-orange-200 p-4">Zajmuję 1/3</div>
        </div>

        9. Równe wysokości (Stretch)
        Domyślne zachowanie items-stretch. Wszystkie dzieci mają wysokość najwyższego
        <div className="flex items-stretch gap-2">
          <div className="bg-teal-500 flex-1 p-2">Krótki tekst</div>
          <div className="bg-teal-200 flex-1 p-2 h-20">Bardzo długi tekst, który rozciąga całą kolumnę w dół...</div>
        </div>

        10. Holy Grail Layout (Trzy kolumny)
        <div className="flex h-48 text-center text-white">
          <div className="w-16 bg-slate-700">L</div>
          <div className="flex-1 bg-slate-500">CONTENT</div>
          <div className="w-16 bg-slate-700">R</div>
        </div>
        
    </div>
  );
}