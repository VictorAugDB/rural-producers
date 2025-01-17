export function generateFakeCPF(): string {
  // Helper function to calculate a CPF digit
  const calculateDigit = (cpfArray: number[]): number => {
    const factor = cpfArray.length + 1;
    const total = cpfArray.reduce(
      (sum, num, index) => sum + num * (factor - index),
      0,
    );
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Generate the first 9 random digits of the CPF
  const baseDigits = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10),
  );

  // Calculate the first check digit
  const firstCheckDigit = calculateDigit(baseDigits);

  // Add the first check digit to the base digits
  const cpfWithFirstDigit = [...baseDigits, firstCheckDigit];

  // Calculate the second check digit
  const secondCheckDigit = calculateDigit(cpfWithFirstDigit);

  // Complete CPF
  const completeCPF = [...cpfWithFirstDigit, secondCheckDigit].join('');

  // Format CPF as XXX.XXX.XXX-XX
  return completeCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
