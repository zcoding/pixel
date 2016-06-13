/**
 * 卷积运算
 * @param matrix 矩阵
 * @param template 模板
 * @return result 返回矩阵和模板卷积运算的结果
 */
export function Convolution(matrix, template) {
    var result = 0;
    for (var i = 0; i < matrix.length; ++i) {
      result += matrix[i] * template[i];
    }
    return result;
}

/// 辅助函数
/**
 * 升序函数，用于数组排序
 */
export function AscendingOrder(a, b) {
  return a - b;
}
/**
 * 降序函数，用于数组排序
 */
export function DescendingOrder(a, b) {
  return b - a;
}
