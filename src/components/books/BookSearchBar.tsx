type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function BookSearchBar({ value, onChange }: Props) {
  return (
    <div className='search'>
      <input
        className='input'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search books (e.g. "Dune", "isbn:9780143127741", "inauthor:Le Guin")'
        spellCheck={false}
      />
      {value && (
        <button className='btn btn--ghost' onClick={() => onChange('')}>
          Clear
        </button>
      )}
    </div>
  );
}
