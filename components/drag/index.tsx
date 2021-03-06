import { PureComponent, cloneElement } from 'react';
import PropsType from './PropsType';

export interface DragProps extends PropsType { }

export default class Drag extends PureComponent<DragProps, {}> {
  private dragState = Object.create(null);

  onTouchStart = (event) => {
    const dragState = this.dragState;
    dragState.startTime = new Date();

    if (!event.touches) {
      dragState.startX = event.clientX;
      dragState.startY = event.clientY;
    } else {
      const touch = event.touches[0];
      dragState.startX = touch.pageX;
      dragState.startY = touch.pageY;
    }

    const { onDragStart } = this.props;
    if (typeof onDragStart === 'function') {
      onDragStart(event, dragState);
    }
  }

  onTouchMove = (event) => {
    const dragState = this.dragState;
    let currentX: number;
    let currentY: number;

    if (!event.touches) {
      currentX = event.clientX;
      currentY = event.clientY;
    } else {
      const touch = event.touches[0];
      currentX = touch.pageX;
      currentY = touch.pageY;
    }

    const offsetX = currentX - dragState.startX;
    const offsetY = currentY - dragState.startY;

    const state = {
      ...dragState,
      offsetX,
      offsetY,
      currentX,
      currentY,
    };

    const { onDragMove } = this.props;
    if (typeof onDragMove === 'function' && !onDragMove(event, state)) {
      return;
    }

    this.dragState = state;
  }

  onTouchEnd = (event) => {
    const dragState = this.dragState;
    const { onDragEnd } = this.props;
    if (typeof onDragEnd === 'function') {
      onDragEnd(event, dragState);
    }
    this.dragState = Object.create(null);
  }

  render() {
    const { children } = this.props;
    return cloneElement(children, {
      onTouchStart: this.onTouchStart,
      onTouchMove: this.onTouchMove,
      onTouchEnd: this.onTouchEnd,
      onMouseDown: this.onTouchStart,
      onMouseMove: this.onTouchMove,
      onMouseUp: this.onTouchEnd,
    });
  }
}
