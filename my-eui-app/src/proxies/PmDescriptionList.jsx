// ─── PROXY: PmDescriptionList ───────────────────────────────────────────────
// Source: propertymeld/frontend/src/shared/components/DetailSection/PmDescriptionList.tsx
// Wraps:  EuiFlexGroup/Item + EuiText + EuiLink + EuiIconTip + EuiTextColor (NOT EuiDescriptionList)
//
// Noise removed (behavior unchanged):
//   • react-linkify wrappers dropped (prod auto-links URLs in string descriptions).
//   • QUESTION_MARK_ICON_URL svg → EUI "questionInCircle".
//   • @pm-frontend/styles colors → mirrored source tokens.
//
// Faithful deviations from lab rules (flag, don't fix):
//   • Explicitly REPLACES EuiDescriptionList "for more layout control" — rebuilt from
//     flex + raw <dl>/<dt>/<dd>. Candidate to reconcile with EUI.
//   • Array descriptions hard-truncate at 2 items + "See All" link (unless displayAll).
//   • Title text forced 700 weight, gray800, via inline style.
//   • Uses index as React key (prod comment: "order will never change").
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiIcon, EuiIconTip, EuiLink, EuiText, EuiTextColor } from '@elastic/eui';
import { Link } from 'react-router-dom';
import { colors } from './_pmSourceTokens';

const seeAllLink = (onClick, dataTestId) => {
  const onClickObj = typeof onClick === 'function' ? { onClick } : {};
  return (
    <EuiLink
      {...onClickObj}
      color="primary"
      style={{ fontWeight: 700, width: 'max-content' }}
      data-testid={dataTestId ? dataTestId['data-testid'] + '-see-all-link' : undefined}
    >
      See All
    </EuiLink>
  );
};

const getSingleTitleAction = (action) => {
  if ('onClick' in action) {
    return (
      <EuiLink onClick={action.onClick} data-testid={action.dataTestId}>
        <EuiFlexGroup gutterSize="s" direction="row" alignItems="center">
          {action.icon && <EuiIcon type={action.icon} />}
          <EuiText size="s">{action.text}</EuiText>
        </EuiFlexGroup>
      </EuiLink>
    );
  } else if ('href' in action) {
    return (
      <Link to={action.href}>
        <EuiLink data-testid={action.dataTestId}>
          <EuiText size="s">{action.text}</EuiText>
        </EuiLink>
      </Link>
    );
  }
  return null;
};

const transformListItemTitle = (item) => {
  let titleText;
  if (typeof item.title === 'string') {
    titleText = (
      <span>
        <EuiText size="s" color={colors.neutrals.gray800} style={{ fontWeight: 700 }} data-testid={item.titleDataTestId}>
          {item.title}
        </EuiText>
      </span>
    );
  } else {
    titleText = item.title;
  }

  let titleActions;
  if (Array.isArray(item.titleAction)) {
    titleActions = (
      <span>
        {item.titleAction
          .filter((action) => !Object.prototype.hasOwnProperty.call(action, 'enabled') || action.enabled)
          .map((action, index, arr) => (
            <React.Fragment key={action.text}>
              {getSingleTitleAction(action)}
              {index < arr.length - 1 && <span style={{ margin: '0 4px' }}>{' • '}</span>}
            </React.Fragment>
          ))}
      </span>
    );
  } else if (item.titleAction && (!Object.prototype.hasOwnProperty.call(item.titleAction, 'enabled') || item.titleAction.enabled)) {
    titleActions = getSingleTitleAction(item.titleAction);
  }

  const titleTooltip = item.titleHelpTooltip ? (
    <EuiIconTip
      type="questionInCircle"
      color={colors.neutrals.gray800}
      content={item.titleHelpTooltip}
      iconProps={{ className: 'eui-alignTop', size: 's' }}
    />
  ) : null;

  return (
    <EuiFlexGroup
      direction="row"
      alignItems="center"
      justifyContent={item.titleActionAlignment === 'right' ? 'spaceBetween' : 'flexStart'}
      responsive={false}
      style={{ gap: '16px' }}
    >
      <EuiFlexItem grow={false}>
        <EuiFlexGroup direction="row" alignItems="center" justifyContent="flexStart" responsive={false} style={{ gap: '6px' }}>
          <EuiFlexItem grow={false}>{titleText}</EuiFlexItem>
          {titleTooltip && <EuiFlexItem grow={false}>{titleTooltip}</EuiFlexItem>}
        </EuiFlexGroup>
      </EuiFlexItem>
      {titleActions && <EuiFlexItem grow={false}>{titleActions}</EuiFlexItem>}
    </EuiFlexGroup>
  );
};

const transformListItemDescription = (value) => {
  if (typeof value === 'string') {
    return (
      <EuiText size="s" color={colors.neutrals.gray800} className="preWhiteSpace" style={{ wordWrap: 'break-word' }}>
        {value}
      </EuiText>
    );
  }
  return value;
};

const transformListItems = (listItems) =>
  listItems.map((item) => {
    const newTitle = transformListItemTitle(item);
    let descriptionIsArray;
    let newDescription;
    if (!Array.isArray(item.description)) {
      descriptionIsArray = false;
      newDescription = transformListItemDescription(item.description);
    } else {
      descriptionIsArray = true;
      newDescription = item.description.map(transformListItemDescription);
    }
    return {
      title: newTitle,
      description: newDescription,
      descriptionIsArray,
      dataTestId: item.dataTestId,
      descriptionSeeAllOnClick: item.descriptionSeeAllOnClick,
      displayAll: item.displayAll,
    };
  });

export default function PmDescriptionList({
  listItems,
  gapInPx = 16,
  'data-testid': listDataTestId,
  direction = 'column',
  responsive = true,
}) {
  const filteredListItems = listItems.filter(
    (item) => !Object.prototype.hasOwnProperty.call(item, 'enabled') || item.enabled
  );

  const mapDescriptionToFlexItems = (description, descriptionSeeAllOnClick, dataTestId, displayAll = false) => {
    const dataTestIdProp = dataTestId ? { 'data-testid': dataTestId } : {};
    if (!Array.isArray(description)) {
      return (
        <EuiFlexItem grow={false} {...dataTestIdProp}>
          <dd>{description}</dd>
        </EuiFlexItem>
      );
    }
    return (
      <dd>
        <EuiFlexItem grow={false} {...dataTestIdProp}>
          <EuiFlexGroup direction="column" gutterSize="none" alignItems="flexStart">
            {description.map((item, index) => {
              if (index >= 2 && displayAll === false) return null;
              return (
                <EuiFlexItem key={index} grow={false}>
                  {item}
                </EuiFlexItem>
              );
            })}
          </EuiFlexGroup>
        </EuiFlexItem>
        {description.length > 2 && displayAll === false ? (
          <EuiFlexItem grow={false}>{seeAllLink(descriptionSeeAllOnClick, dataTestIdProp)}</EuiFlexItem>
        ) : null}
      </dd>
    );
  };

  return (
    <dl>
      <EuiFlexGroup
        direction={direction}
        alignItems="stretch"
        style={{ gap: gapInPx, wordBreak: 'break-word' }}
        data-testid={listDataTestId}
        responsive={responsive}
      >
        {transformListItems(filteredListItems).map((listItem, index) => (
          <EuiFlexItem grow={true} key={index}>
            <EuiFlexGroup direction="column" gutterSize="xs" alignItems="stretch" justifyContent="spaceBetween">
              <EuiFlexItem grow={true}>
                <EuiTextColor color={colors.neutrals.gray800}>
                  <dt>{listItem.title}</dt>
                </EuiTextColor>
              </EuiFlexItem>
              <EuiTextColor color={colors.neutrals.gray800}>
                {mapDescriptionToFlexItems(
                  listItem.description,
                  listItem.descriptionSeeAllOnClick,
                  listItem.dataTestId,
                  listItem.displayAll
                )}
              </EuiTextColor>
            </EuiFlexGroup>
          </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </dl>
  );
}
