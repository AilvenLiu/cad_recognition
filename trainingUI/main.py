import sys
import numpy as np
from PyQt6.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                             QPushButton, QLabel, QComboBox, QCheckBox, QRadioButton, 
                             QProgressBar, QSplitter, QFrame, QScrollArea)
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QFont, QColor, QPalette
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas

class ModelTrainingGUI(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("CAD Matching Model Training")
        self.setGeometry(100, 100, 1800, 1000)
        
        # Set the color palette
        palette = QPalette()
        palette.setColor(QPalette.ColorRole.Window, QColor("#F0F0F0"))
        palette.setColor(QPalette.ColorRole.WindowText, QColor("#333333"))
        palette.setColor(QPalette.ColorRole.Button, QColor("#2980b9"))
        palette.setColor(QPalette.ColorRole.ButtonText, QColor("#FFFFFF"))
        palette.setColor(QPalette.ColorRole.Highlight, QColor("#3498db"))
        self.setPalette(palette)

        self.setStyleSheet("""
            QMainWindow {background-color: #F0F0F0;}
            QLabel {font-size: 14px; color: #333333;}
            QPushButton {
                background-color: #2980b9;
                color: white;
                border: none;
                padding: 10px;
                font-size: 14px;
                font-weight: bold;
                border-radius: 5px;
            }
            QPushButton:hover {background-color: #3498db;}
            QComboBox, QCheckBox, QRadioButton {
                font-size: 14px;
                color: #333333;
                padding: 5px;
                border: 1px solid #CCCCCC;
                border-radius: 3px;
                background-color: white;
            }
            QComboBox::drop-down {
                subcontrol-origin: padding;
                subcontrol-position: top right;
                width: 15px;
                border-left-width: 1px;
                border-left-color: #CCCCCC;
                border-left-style: solid;
            }
            QScrollArea {
                border: none;
                background-color: transparent;
            }
            QFrame#ContentFrame {
                background-color: white;
                border: 1px solid #CCCCCC;
                border-radius: 10px;
            }
        """)

        self.central_widget = QWidget()
        self.setCentralWidget(self.central_widget)
        self.main_layout = QVBoxLayout(self.central_widget)

        self.create_widgets()

    def create_widgets(self):
        # Logo and Title in the same row
        header_layout = QHBoxLayout()
        
        # Logo placeholder
        logo_placeholder = QLabel()
        logo_placeholder.setFixedSize(120, 120)
        logo_placeholder.setStyleSheet("background-color: #CCCCCC; border-radius: 60px;")
        logo_placeholder.setAlignment(Qt.AlignmentFlag.AlignCenter)
        logo_placeholder.setText("LOGO")
        header_layout.addWidget(logo_placeholder)

        # Title
        title = QLabel("CAD Matching Model Training")
        title.setAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignVCenter)
        title.setFont(QFont("Helvetica", 40, QFont.Weight.Bold))
        title.setStyleSheet("color: #2c3e50; background-color: transparent;")
        title.setFixedHeight(120)
        header_layout.addWidget(title)
        
        header_layout.addStretch()
        self.main_layout.addLayout(header_layout)

        # Main content
        content_layout = QHBoxLayout()
        splitter = QSplitter(Qt.Orientation.Horizontal)

        # Configuration section
        config_widget = QFrame()
        config_widget.setObjectName("ContentFrame")
        config_scroll = QScrollArea()
        config_scroll.setWidgetResizable(True)
        config_scroll.setWidget(config_widget)
        config_layout = QVBoxLayout(config_widget)
        self.create_config_section(config_layout)
        splitter.addWidget(config_scroll)

        # Monitoring section
        monitoring_widget = QFrame()
        monitoring_widget.setObjectName("ContentFrame")
        monitoring_layout = QVBoxLayout(monitoring_widget)
        self.create_monitoring_section(monitoring_layout)
        splitter.addWidget(monitoring_widget)

        content_layout.addWidget(splitter)
        self.main_layout.addLayout(content_layout)

    def create_config_section(self, layout):
        layout.addWidget(self.create_header("Configuration"))

        # Model Architecture
        layout.addWidget(self.create_subheader("Model Architecture"))
        layout.addWidget(QComboBox(currentText="ConvNeXt Tiny"))
        layout.addWidget(QComboBox(currentText="MobileNetV2"))

        # Loss Functions
        layout.addWidget(self.create_subheader("Loss Functions"))
        for loss in ["Triplet", "NT-Xent", "ArcFace", "Classification", "BYOL", "Distillation"]:
            layout.addWidget(QCheckBox(loss))

        # Data Augmentations
        layout.addWidget(self.create_subheader("Data Augmentations"))
        for aug in ["Random Flip", "Random Rotation", "Random Crop", "Color Jitter", "CLAHE"]:
            layout.addWidget(QCheckBox(aug))

        # Distance Metric
        layout.addWidget(self.create_subheader("Distance Metric"))
        layout.addWidget(QRadioButton("Euclidean Distance"))
        layout.addWidget(QRadioButton("Cosine Similarity"))

        # Global buttons
        # layout.addWidget(self.create_subheader("Model Operations"))
        for text in ["Load Pre-train Model", "Save Threshold File", "Save Model", "Quantize Model", "Export Model"]:
            layout.addWidget(QPushButton(text))

        layout.addStretch()

    def create_monitoring_section(self, layout):
        layout.addWidget(self.create_header("Training Monitoring"))

        # Matplotlib figure
        self.figure, (self.ax1, self.ax2) = plt.subplots(2, 1, figsize=(8, 8))
        self.canvas = FigureCanvas(self.figure)
        layout.addWidget(self.canvas)

        self.loss_line, = self.ax1.plot([], [], 'r-', label='Training Loss')
        self.val_loss_line, = self.ax1.plot([], [], 'b-', label='Validation Loss')
        self.acc_line, = self.ax2.plot([], [], 'g-', label='Training Accuracy')
        self.val_acc_line, = self.ax2.plot([], [], 'm-', label='Validation Accuracy')
        
        for ax in (self.ax1, self.ax2):
            ax.legend()
            ax.set_xlabel('Epoch')
            ax.grid(True, linestyle='--', alpha=0.7)
        self.ax1.set_ylabel('Loss')
        self.ax2.set_ylabel('Accuracy')

        # Status and progress
        status_layout = QHBoxLayout()
        self.status_label = QLabel("Status: Not Started")
        status_layout.addWidget(self.status_label)
        self.progress_bar = QProgressBar()
        status_layout.addWidget(self.progress_bar)
        self.train_button = QPushButton("Start Training")
        self.train_button.clicked.connect(self.toggle_training)
        status_layout.addWidget(self.train_button)
        layout.addLayout(status_layout)

    def create_header(self, text):
        label = QLabel(text)
        label.setFont(QFont("Helvetica", 24, QFont.Weight.Bold))
        label.setStyleSheet("color: #2c3e50; margin-bottom: 15px; background-color: transparent; border: none;")
        return label

    def create_subheader(self, text):
        label = QLabel(text)
        label.setFont(QFont("Helvetica", 18, QFont.Weight.Bold))
        label.setStyleSheet("color: #34495e; margin-top: 15px; margin-bottom: 10px; background-color: transparent; border: none;")
        return label

    def toggle_training(self):
        if self.train_button.text() == "Start Training":
            self.start_training()
            self.train_button.setText("Early Stop")
        else:
            self.stop_training()
            self.train_button.setText("Start Training")

    def start_training(self):
        self.status_label.setText("Status: Training...")
        self.progress_bar.setValue(0)
        self.x_data = []
        self.train_loss_data = []
        self.val_loss_data = []
        self.train_acc_data = []
        self.val_acc_data = []
        self.timer = QTimer()
        self.timer.timeout.connect(self.update_training)
        self.timer.start(50)

    def stop_training(self):
        self.timer.stop()
        self.status_label.setText("Status: Training Stopped")

    def update_training(self):
        progress = len(self.x_data)
        if progress >= 100:
            self.stop_training()
            self.train_button.setText("Start Training")
            return

        self.progress_bar.setValue(progress)
        self.x_data.append(progress)
        self.train_loss_data.append(1 - 0.5 * np.exp(-0.05 * progress) + 0.1 * np.random.randn())
        self.val_loss_data.append(1 - 0.4 * np.exp(-0.04 * progress) + 0.15 * np.random.randn())
        self.train_acc_data.append(0.5 + 0.4 * (1 - np.exp(-0.05 * progress)) + 0.05 * np.random.randn())
        self.val_acc_data.append(0.5 + 0.35 * (1 - np.exp(-0.04 * progress)) + 0.07 * np.random.randn())

        if progress % 5 == 0:  # Update plot every 5 steps
            self.loss_line.set_data(self.x_data, self.train_loss_data)
            self.val_loss_line.set_data(self.x_data, self.val_loss_data)
            self.acc_line.set_data(self.x_data, self.train_acc_data)
            self.val_acc_line.set_data(self.x_data, self.val_acc_data)

            for ax in (self.ax1, self.ax2):
                ax.relim()
                ax.autoscale_view()

            self.canvas.draw()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = ModelTrainingGUI()
    window.show()
    sys.exit(app.exec())