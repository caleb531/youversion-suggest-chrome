import m from 'mithril';

// Fetch the HTML contents at the given URL (with the given GET parameters)
export function getHTML(baseURL, getParams) {
  return m.request({
    url: baseURL,
    data: getParams,
    // By default, Mithril will try to parse response as JSON; return raw data
    // instead, since we are expecting HTML
    deserialize: (content) => content,
    // Do not redraw views after request completion
    background: true
  });
}

// Fetch any arbitrary JSON data via the given data file path
export function getJSON(dataFilePath) {
  return m.request({
    url: dataFilePath,
    // Again, no need to redraw upon completion
    background: true
  });
}
