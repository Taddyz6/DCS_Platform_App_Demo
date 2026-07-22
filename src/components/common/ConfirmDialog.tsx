import { Button, Modal, Space, Typography } from 'antd';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={confirmText}
      cancelText={cancelText}
    >
      <Space direction="vertical" size={12}>
        <Typography.Paragraph className="confirm-dialog-copy">
          {description}
        </Typography.Paragraph>
        <Button type="dashed" onClick={onCancel}>
          返回继续编辑
        </Button>
      </Space>
    </Modal>
  );
}
