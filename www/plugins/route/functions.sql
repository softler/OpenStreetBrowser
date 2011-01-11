CREATE OR REPLACE FUNCTION route_dir(text[], text[]) RETURNS text AS $$
DECLARE
  refs alias for $1;
  roles alias for $2;
  i int;
  dir int;
BEGIN
  dir:=0;
  for i in array_lower(roles, 1)..array_upper(roles, 1) loop
    if roles[i] in ('', 'both') then
      dir:=dir|3;
    elsif substr(roles[i], 1, 7)='forward' then
      dir:=dir|1;
    elsif substr(roles[i], 1, 8)='backward' then
      dir:=dir|2;
    end if;
  end loop;

  return (Array['forward', 'backward', 'both'])[dir];
END;
$$ LANGUAGE plpgsql immutable;

CREATE OR REPLACE FUNCTION route_refs(text[], text[]) RETURNS text AS $$
DECLARE
  refs alias for $1;
  roles alias for $2;
BEGIN
  return array_to_string(array_nat_sort(array_unique(refs)), ', ');
END;
$$ LANGUAGE plpgsql immutable;

CREATE OR REPLACE FUNCTION route_importance(hstore) RETURNS text AS $$
DECLARE
  osm_tags alias for $1;
  route text;
  network text;
BEGIN
  route:=osm_tags->'route';
  network:=osm_tags->'network';

  if route in ('tram', 'bus', 'trolley', 'trolleybus') then
    return 'suburban';
  elsif route in ('light_rail', 'subway') then
    return 'urban';
  elsif route in ('train', 'rail', 'railway', 'ferry') then
    return 'regional';
  elsif network in ('e-road') and route in ('road') then
    return 'international';
  elsif route in ('road') then
    return 'regional';
  elsif network in ('icn', 'iwn') then
    return 'international';
  elsif network in ('ncn', 'nwn') then
    return 'national';
  elsif network in ('rcn', 'rwn') or route in ('hiking') then
    return 'regional';
  elsif network in ('lcn', 'lwn', 'mtb') or route in ('bicycle', 'mtb') then
    return 'suburban';
  end if;

  return 'local';
END;
$$ LANGUAGE plpgsql immutable;

CREATE OR REPLACE FUNCTION route_type(hstore) RETURNS text AS $$
DECLARE
  osm_tags alias for $1;
  route text;
BEGIN
  route:=osm_tags->'route';

  if route in ('bus', 'trolley', 'trolleybus', 'minibus') then
    return 'bus';
  elsif route in ('tram', 'light_rail') then
    return 'tram';
  end if;

  return route;
END;
$$ LANGUAGE plpgsql immutable;
