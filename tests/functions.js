/**
 * @param {NodeListOf<Element | ChildNode>} elements
 * @param {any[]} values
 */
export function expectTextContentsToBeLike(elements, values) {
  expect(elements.length).toBe(values.length)

  values.forEach((value, index) => {
    expect(elements[index].textContent).toBe(value)
  })
}
