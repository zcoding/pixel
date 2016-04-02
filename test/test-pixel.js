/**
 * 卷积运算
 * @param matrix 矩阵
 * @param template 模板
 * @return result 返回矩阵和模板卷积运算的结果
 */
function Convolution(matrix, template) {
  var result = 0;
  for (var i = 0; i < matrix.length; ++i) {
    result += matrix[i] * template[i];
  }
  return result;
}

describe("测试工具函数", function() {
  it("卷积函数运算", function() {
    expect(Convolution([1, 2], [2, 1])).toBe(4);
  });
});
