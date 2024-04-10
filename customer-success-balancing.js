/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
const logger = (message) => console.log(message);
const findCSWithMoreCustomers = (customerSuccess) => {
  let maxCustomers = 0;
  let csIdWithMoreCustomers = 0;
  for (let { id, attendToCustomers } of customerSuccess) {
    const count = attendToCustomers.length;
    if (count > maxCustomers) {
      maxCustomers = count;
      csIdWithMoreCustomers = id;
    } else if (count === maxCustomers) {
      csIdWithMoreCustomers = 0;
    }
  }
  return csIdWithMoreCustomers;
}
function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {
  const startTime = performance.now();
  const maxCssAbstentionAllowed = Math.floor(customerSuccess.length / 2);
  if (customerSuccessAway.length > maxCssAbstentionAllowed) {
    logger(`It's not allowed to have more than ${maxCssAbstentionAllowed} abstentions`);
    return;
  }

  const sortedAvailableCSByAscScore = customerSuccess.filter((cs) => !customerSuccessAway.includes(cs.id)).map(css => ({ ...css, attendToCustomers: [] })).sort((a, b) => a.score - b.score);

  const sortedCustomerAscByScore = [...customers].sort((a, b) => a.score - b.score);

  const attendedCustomerIds = new Set();

  // sortedCustomerAscByScore.forEach(customer => {
  //   const suitableCss = sortedAvailableCSByAscScore.find(cs => cs.score >= customer.score && !attendedCustomerIds.has(customer.id));
  //   if (suitableCss) {
  //     suitableCss.attendToCustomers.push(customer.id);
  //     attendedCustomerIds.add(customer.id);
  //   }
  // });

  for (const customer of customers) {
    for (const css of sortedAvailableCSByAscScore) {
      if (css.score >= customer.score && !attendedCustomerIds.has(customer.id)) {
        css.attendToCustomers.push(customer.id);
        attendedCustomerIds.add(customer.id);
        break;
      }
    }
  }

  const csWithMoreCustomers = findCSWithMoreCustomers(sortedAvailableCSByAscScore);

  const endTime = performance.now();
  logger(`Execution time: ${endTime - startTime} ms`);
  // Initial Solution => 100 ~ 115 ms in test scenario 3
  // First Attempt Solution => 80 ~ 105 ms in test scenario 3

  return csWithMoreCustomers;
}

// // DATA EXAMPLE
// const css = [
//   { id: 1, score: 60 },
//   { id: 2, score: 20 },
//   { id: 3, score: 95 },
//   { id: 4, score: 75 },
// ];
// const customers = [
//   { id: 1, score: 90 },
//   { id: 2, score: 20 },
//   { id: 3, score: 70 },
//   { id: 4, score: 40 },
//   { id: 5, score: 60 },
//   { id: 6, score: 10 },
// ];
// const csAway = [2, 4];

// customerSuccessBalancing(css, customers, csAway)

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt) {
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});
