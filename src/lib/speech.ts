export function speakJapanese(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.92;
  const voices = window.speechSynthesis.getVoices();
  const ja = voices.find((v) => v.lang.startsWith("ja"));
  if (ja) utterance.voice = ja;
  window.speechSynthesis.speak(utterance);
}
