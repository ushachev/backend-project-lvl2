import formatInPretty from './prettyFormatter';
import formatInPlain from './plainFormatter';

const formatInJson = (diff) => JSON.stringify(diff, null, 2);

const formatters = {
  pretty: formatInPretty,
  plain: formatInPlain,
  json: formatInJson,
};

export default (format, diff) => formatters[format](diff);
