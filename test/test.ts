import CheerioExtract from '../src/index';

const ce = new CheerioExtract(`
<div>
    <a id="a" class="a" href="//baidu.com" data-id="link">百度</a>

    <dl>
        <dt>文本</dt>
        <dd><p>内容</p></dd>
    </dl>

    <section>
        前内容<u>下划线</u>后内容
    </section>

    <ul>
        <li data-index="1">
            <a href="//a.com/id1/101">(1)</a>
        </li>
        <li data-index="2">
            <a href="//a.com/id1/102">(2)</a>
        </li>
        <li data-index="3">
            <a href="//a.com/id1/103">(3)</a>
        </li>
        <li data-index="4">
            <a href="//a.com/id1/104">(4)</a>
        </li>
    </ul>
</div>
`);


test('class选择器', () => {
  const result = ce.query('.a :href');
  expect(result).toBe('//baidu.com');
});

test('id选择器', () => {
  const result = ce.query('#a :href');
  expect(result).toBe('//baidu.com');
});


test('获取属性', () => {
  const result = ce.query('.a :href');
  expect(result).toBe('//baidu.com');
});

test('获取自定义属性', () => {
  const result = ce.query('.a :data-id');
  expect(result).toBe('link');
});

test('获取 text', () => {
  const result = ce.query('.a | text');
  expect(result).toBe('百度');
});

test('获取 html', () => {
  const result = ce.query('dd | html');
  expect(result).toBe('<p>内容</p>');
});

test('trim', () => {
  const result = ce.query('section | text | trim');
  expect(result).toBe('前内容下划线后内容');
});

test('添加前缀', () => {
  const result = ce.query('.a :href | prefix(http:)');
  expect(result).toBe('http://baidu.com');
});

test('添加后缀', () => {
  const result = ce.query('.a :href | suffix(?q=123)');
  expect(result).toBe('//baidu.com?q=123');
});

test('删除dom', () => {
  const result = ce.query('section -u | text | trim');
  expect(result).toBe('前内容后内容');
});

test('指定下标1', () => {
  const result = ce.query('ul li:eq(2) :data-index');
  expect(result).toBe('3');
});

test('指定下标2', () => {
  const result = ce.query('ul li | eq(2) :data-index');
  expect(result).toBe('3');
});

test('过滤文本', () => {
  const result = ce.query('section | text | trim | filter(内容, 前)');

  // 因为之前已经删除了u标签，所以没有u标签中的内容
  expect(result).toBe('后');
});

test('过滤文本2', () => {
  const result = ce.query('ul li:eq(2) a :href | filter(/, 1)');

  expect(result).toBe('a.comid03');
});

test('list1', () => {
  const arr = [
    '(1)',
    '(2)',
    '(3)',
    '(4)'
  ];
  const result = ce.query('ul li | array(| text | trim)');

  result.forEach((t: string, index: number) => {
    expect(t).toEqual(arr[index]);
  });
});

test('list2', () => {
  const arr = [
    ['1', '(1)'],
    ['2', '(2)'],
    ['3', '(3)'],
    ['4', '(4)']
  ];
  const result = ce.query('ul li | array((:data-index), (a | text))');

  result.forEach((t: string, index: number) => {
    expect(t[0]).toEqual(arr[index][0]);
    expect(t[1]).toEqual(arr[index][1]);
  });
});

test('list3', () => {
  interface Obj {
    title: string;
    href: string;
  }
  const arr: Array<Obj> = [
    { href: 'https://a.com/id1/101', title: '(1)' },
    { href: 'https://a.com/id1/102', title: '(2)' },
    { href: 'https://a.com/id1/103', title: '(3)' },
    { href: 'https://a.com/id1/104', title: '(4)' },
  ];
  const result = ce.query('ul a | array(href => (:href | prefix(https:)), title => (| text))');

  result.forEach((t: Obj, index: number) => {
    expect(t.href).toEqual(arr[index].href);
    expect(t.title).toEqual(arr[index].title);
  });
});

test('自定义过滤器', () => {
  ce.useFilter('customize', (str: any, p: any, s: any): any => p + str + s);

  const result = ce.query('.a :href | customize(https:, ?q=123)');
  expect(result).toBe('https://baidu.com?q=123');
});
