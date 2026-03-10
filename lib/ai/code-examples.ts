// 代码示例数据
export async function getCodeExamples(
  language: string,
  category: string = "basic",
  limit: number = 5
): Promise<Array<{ title: string; code: string; description: string }>> {
  
  const examples: Record<string, Array<{ title: string; code: string; description: string }>> = {
    javascript: [
      {
        title: "异步函数处理",
        code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}`,
        description: "使用async/await处理异步请求的最佳实践",
      },
      {
        title: "数组操作",
        code: `// 过滤、映射、归约
const numbers = [1, 2, 3, 4, 5];
const doubledEvenNumbers = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .reduce((sum, n) => sum + n, 0);`,
        description: "函数式数组操作示例",
      },
    ],
    python: [
      {
        title: "文件操作",
        code: `def read_file(filepath):
    """读取文件内容"""
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        print(f"文件不存在: {filepath}")
        return None
    except Exception as e:
        print(f"读取文件时出错: {e}")
        return None`,
        description: "Python文件读取的异常处理",
      },
      {
        title: "装饰器",
        code: `import time
from functools import wraps

def timing_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} 执行时间: {end_time - start_time:.4f}秒")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(2)
    return "完成"`,
        description: "Python装饰器实现函数计时",
      },
    ],
    typescript: [
      {
        title: "类型安全的API调用",
        code: `interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error('获取用户信息失败');
  }
  return response.json();
}

// 使用
const user = await getUser(1);
console.log(user.name);`,
        description: "TypeScript类型安全的API调用",
      },
    ],
  }

  return examples[language]?.slice(0, limit) || []
}
