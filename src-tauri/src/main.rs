use tauri::{App, State};

use std::sync::{Arc, Mutex};

#[derive(Debug, Default)]
struct MyState(Arc<Mutex<i32>>);

impl MyState {
    fn change(&self, count: i32) {
        *self.0.lock().unwrap() += count;
    }
}

pub type SetupHook = Box<dyn FnOnce(&mut App) -> Result<(), Box<dyn std::error::Error>> + Send>;

#[derive(Default)]
pub struct AppBuilder {
    setup: Option<SetupHook>,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn change_count(count: i32, state: State<'_, MyState>) -> i32 {
    state.inner().change(count);
    *state.inner().0.lock().unwrap()
}

impl AppBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    #[must_use]
    pub fn setup<F>(mut self, setup: F) -> Self
    where
        F: FnOnce(&mut App) -> Result<(), Box<dyn std::error::Error>> + Send + 'static,
    {
        self.setup.replace(Box::new(setup));
        self
    }

    pub fn run(self) {
        tauri::Builder::default()
            .manage(MyState::default())
            .invoke_handler(tauri::generate_handler![greet, change_count])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
    }
}
fn main() {
    AppBuilder::new().run();
}
