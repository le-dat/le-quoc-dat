##### Root

```sh
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
```

##### Refactor

```sh
const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
```

=> Code Cleanup: Removed redundant variable props and improved readability by directly destructuring parameters in the function signature

##### Root

```sh
const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };
```

##### Refactor

```sh
  const getPriority = useCallback((blockchain: string): number => {
    const priorities: Record<string, number> = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };
    return priorities[blockchain] ?? -99;
  }, []);
```

=> Encapsulation with useCallback:

- optimize implementation object instead of switch case for maintain reader
  The getPriority function is memoized using useCallback for performance optimization

##### Root

```sh
const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (balancePriority > -99) {
        if (balance.amount > 0) {
          return true;
        }
      }
      return false;
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
      return 0;
    });
  }, [balances, prices]);
```

##### Refactor

```sh

  const sortedBalances = useMemo(() =>
    balances.filter(({ blockchain, amount }) =>
      getPriority(blockchain) > -99 && amount > 0
    ).sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain)),
    [balances, getPriority]
  );

```

=> Logic Simplification: Combined filtering and sorting logic in useMemo to streamline balance operations.

##### Root

```sh
    const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(2),
      };
    });

    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });

```

##### Refactor

```sh

  const formattedBalances = useMemo(() =>
    sortedBalances.map(balance => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    })),
    [sortedBalances]
  );


  const rows = useMemo(() =>
    formattedBalances.map(({ currency, amount, formatted }, index) => {
      const usdValue = prices[currency] * amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={amount}
          usdValue={usdValue}
          formattedAmount={formatted}
        />
      );
    }),
    [formattedBalances, prices]
  );
```

=> useMemo to streamline balance operations and ensure the computations are only recalculated when dependencies change
