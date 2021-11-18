# @celebi/cheerio-extract

Use the string of the specified rule to get the information

## Usage

```html
const HTML = `
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
`

const ce = new CheerioExtract(HTML);

// Get data
ce.query();
// Add custom function
ce.useFilter();
```


## Grammar
- Attribute related `:AttributeName`, case: `:href`
- Remove dom `-Tag`, case `-p` Remove p tag
- Filter method: `| functionName(parameter1, ..., parameterN)`, case: `| prefix(a, b)`
  Other forms `| functionName((parameter1), ..., (parameterN))` Parameter wrap(), `| functionName` no parameters required

### attribute

```javascript
ce.query('.a :href')               // output -> //baidu.com
ce.query('.a :data-id')            // output -> link
```

### html or text
```javascript
ce.query('.a | text')              // output -> 百度
ce.query('dd | html')              // output -> <p>内容</p>
```

### delete dom
```javascript
ce.query('section -u | text | trim');        // output -> 前内容后内容
```

### add prefix or suffix
```javascript
ce.query('.a :href | prefix(http:)')                     // output -> http://baidu.com
ce.query('.a :href | suffix(?q=123)')                    // output -> //baidu.com?q=123
ce.query('.a :href | prefix(http:) | suffix(?q=123)')     // output -> http://baidu.com?q=123
```

### eq
```javascript
ce.query('ul li:eq(2) :data-index')        // output -> 3
ce.query('ul li | eq(2) :data-index')      // output -> 3
```

### filter text

```javascript
ce.query('ul li:eq(2) a :href | filter(/, 1)')     // output -> a.comid03
```


### list

grammar
- Get one: `| array(Rule)`
- Two-dimensional array: `| array((Rule1), (Rule2))`
- Object data: `| array(Key1 => (Rule1), Key2 => (Rule2))`

Get one

```javascript
ce.query('ul li | array(| text | trim)')

// output ->
  [
    '(1)',
    '(2)',
    '(3)',
    '(4)'
  ]
```

Two-dimensional array
Note: The parameter is best to add ()

```javascript
ce.query('ul li | array((:data-index), (a | text))')

// output ->
  [
    ['1', '(1)'],
    ['2', '(2)'],
    ['3', '(3)'],
    ['4', '(4)']
  ];
```

Object data
=> The front is the key, => The following is the rule, the rule is best to be wrapped with ()

```javascript
ce.query('ul a | array(href => (:href | prefix(https:)), title => (| text))')

// output ->
  [
    { href: 'https://a.com/id1/101', title: '(1)' },
    { href: 'https://a.com/id1/102', title: '(2)' },
    { href: 'https://a.com/id1/103', title: '(3)' },
    { href: 'https://a.com/id1/104', title: '(4)' }
  ];
```


