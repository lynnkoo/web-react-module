import * as React from 'react'
import * as ReactDOM from 'react-dom'

const POPUPLAYER_ID = 'PopupLayer'

const createPopupLayer = (): HTMLElement => {
  const node = document.createElement('div')
  node.id = POPUPLAYER_ID
  node.className = 'position-fill fixed'
  document.body.appendChild(node)
  return node
}

const removePopupLayer = (rootNode: HTMLElement) => {
  if (rootNode.children.length === 1) {
    document.body.removeChild(rootNode)
  }
}

class PopupComponent extends React.Component<any> {
  rootNode = document.getElementById(POPUPLAYER_ID) || createPopupLayer()

  componentWillUnmount() {
    removePopupLayer(this.rootNode)
  }

  render() {
    return ReactDOM.createPortal(
      <React.Fragment>
        {this.props.children}
      </React.Fragment>,
      this.rootNode,
    )
  }
}

// const PopupComponent: React.SFC = (props: any) => {
//   const rootNode = document.getElementById(POPUPLAYER_ID) || createPopupLayer()

//   useEffect(() => () => {
//     removePopupLayer(rootNode)
//   });

//   const onPopLayerClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     event.stopPropagation()
//   }

//   const { position } = props
//   return ReactDOM.createPortal(
//     <PopupLayout className={position} onClick={onPopLayerClick}>
//       {props.children}
//     </PopupLayout>,
//     rootNode,
//   )
// }


export const PopoverGroup = (props: any) => {
  const { children } = props

  const popoverRefs: any[] = []

  const onCloseGroup = () => {
    popoverRefs.forEach((ref: any) => ref.hide())
  }

  let renderChild = null

  React.Children.forEach(children, (child) => {
    if (!child || typeof child === 'string' || typeof child === 'number') {
      return
    }
    const { popover } = child.props
    popoverRefs.push(popover)
    if (popover.isActive) {
      renderChild = React.cloneElement(child, {
        popover,
        group: { 
          hide: onCloseGroup,
        } 
      })
    }
  })

  return renderChild && (
    <PopupComponent>
      {renderChild}
    </PopupComponent>
  )
}

export const enhancePopover = (WrappedComponent: any) => (props: any) => {
  const { group, popover } = props
  return group ? (
    <WrappedComponent {...props} popover={popover} group={group} />
  ) : popover.isActive && (
    <PopupComponent>
      <WrappedComponent {...props} popover={popover}  />
    </PopupComponent>
  )
}

export const usePopoverStatus= () => {
  const [isActive, setActive] = React.useState(false)
  return {
    isActive,
    show: () => setActive(true),
    hide: () => setActive(false),
  }
}
