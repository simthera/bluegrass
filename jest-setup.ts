require("@shopify/flash-list/jestSetup");

(global.fetch as jest.Mock) = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: "mock data" }),
  })
);

jest.spyOn(Intl, "NumberFormat").mockImplementation((locale, options) => {
  if (locale === "en-ZA" && options?.currency === "ZAR") {
    return {
      format: (value: number) => {
        // Convert the number to the desired format: "R1,234.00"
        const [integer, fraction = "00"] = value
          .toFixed(2) // Ensure two decimal places
          .split("."); // Split integer and fraction

        const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas as thousand separators

        return `R${formattedInteger}.${fraction}`;
      },
    } as unknown as Intl.NumberFormat;
  }
  return new (Intl.NumberFormat as any)(locale, options);
});

const Dimensions = {
  get: jest.fn().mockReturnValue({ width: 100, height: 100 }),
};
module.exports = Dimensions;
