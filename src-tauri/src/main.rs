use tauri::{App, State};

use tauri::async_runtime::Mutex;

use std::sync::Arc;

#[derive(Debug, Default)]
struct MyState(Arc<Mutex<i32>>);

impl MyState {
    async fn change(&self, count: i32) -> i32 {
        let mut inner = self.0.lock().await;
        *inner += count;
        *inner
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
async fn change_count(count: i32, state: State<'_, MyState>) -> Result<i32, ()> {
    Ok(state.inner().change(count).await)
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
