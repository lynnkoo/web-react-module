import * as React from 'react'
import * as ReactDOM from 'react-dom'

const POPUPLAYER_ID = 'PopupLayer'

const createPopupLayer = (): HTMLElement => {
  const node = document.createElement('div')
  node.id = POPUPLAYER_ID
  document.body.style.overflow = 'hidden'
  document.body.appendChild(node)
  return node
}

const removePopupLayer = (rootNode: HTMLElement) => {
  if (rootNode.children.length === 1) {
    document.body.style.overflow = 'auto'
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

  const popupComponentRefs: any[] = []

  const onCloseGroup = () => {
    popupComponentRefs.forEach((ref: any) => ref.hide())
  }

  let renderChild = null

  React.Children.forEach(children, (child) => {
    if (!child || typeof child === 'string' || typeof child === 'number') {
      return
    }
    const { entity } = child.props
    popupComponentRefs.push(entity)
    if (entity.isActive) {
      renderChild = React.cloneElement(child, {
        entity,
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

export const enhancePopupComponent = (WrappedComponent: any) => (props: any) => {
  const { group, entity } = props
  return group ? (
    <WrappedComponent {...props} entity={entity} group={group} />
  ) : entity.isActive && (
    <PopupComponent>
      <WrappedComponent {...props} entity={entity}  />
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
