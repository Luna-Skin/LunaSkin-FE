export default function MyIcon({ color = "currentColor", size = 18 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M14.2493 15.7497V14.2498C14.2493 13.4542 13.9332 12.6912 13.3707 12.1286C12.8081 11.5661 12.0451 11.25 11.2495 11.25H6.7498C5.9542 11.25 5.19119 11.5661 4.62862 12.1286C4.06605 12.6912 3.75 13.4542 3.75 14.2498V15.7497" stroke={color} strokeWidth="1.27491" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.9998 8.2496C10.6565 8.2496 11.9996 6.90654 11.9996 5.2498C11.9996 3.59306 10.6565 2.25 8.9998 2.25C7.34306 2.25 6 3.59306 6 5.2498C6 6.90654 7.34306 8.2496 8.9998 8.2496Z" stroke={color} strokeWidth="1.27491" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}