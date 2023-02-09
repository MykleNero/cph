const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  describe("When given no input", () => {
    it("Returns the literal '0'", () => {
      const trivialKey = deterministicPartitionKey();
      expect(trivialKey).toBe("0");
    });
  });

  describe("When given an input", () => {
    describe("When partition key is provided", () => {
      it("Returns the partition key", () => {
        const trivialKey = deterministicPartitionKey({
          partitionKey: "abc123",
        });
        expect(trivialKey).toBe("abc123");
      });

      it("Returns a hash of the partition key if it is not a string", () => {
        const trivialKey = deterministicPartitionKey({
          partitionKey: ["a", "b", "c", "1", "2", "3"],
        });
        expect(trivialKey).toBe('["a","b","c","1","2","3"]');
      });

      it("Returns a hash of the partition key if it is longer than the maximum partition key length", () => {
        const trivialKey = deterministicPartitionKey({
          partitionKey: new Array(257).fill("a"),
        });
        expect(trivialKey).toBe(
          "e46ff5cfc0850ab91e3e6e1f25ed68778ba22e8085981ebf86111b99c5855c2a4d4dbc5a24775006fc99b95af0d77cbcdb5e2dc7caf25e5e4f8127aa0af7b6dd"
        );
      });
    });

    describe("When partition key is not provided", () => {
      it("Returns a hash of the input", () => {
        const trivialKey = deterministicPartitionKey([
          "a",
          "b",
          "c",
          "1",
          "2",
          "3",
        ]);
        expect(trivialKey).toBe(
          "3d3e1a4bb17167884cc63e5a846c4a119af26221b11e599fba0dfa11a7423b48397e891a939aeea1c7361c5375e3bd51bf7a08e3654a296d1ca9f9be3904fb6c"
        );
      });
    });
  });

  describe("When given an object as input", () => {
    it("Returns a hash of the object", () => {
      let trivialKey = deterministicPartitionKey({});
      expect(trivialKey).toBe(
        "c1802e6b9670927ebfddb7f67b3824642237361f07db35526c42c555ffd2dbe74156c366e1550ef8c0508a6cc796409a7194a59bba4d300a6182b483d315a862"
      );

      trivialKey = deterministicPartitionKey({ hello: "world" });
      expect(trivialKey).toBe(
        "a8034f17272123164ee10dabf4a4e2da80b1b19f585b52b9f88cce2ab87c67b067a7746c44632b27a8ad5ed9a71768551b2b9251f019ac715d5168dc06e88fa4"
      );
    });
  });
});
