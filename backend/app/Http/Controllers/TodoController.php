<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Exception;

class TodoController extends Controller
{
    public function index()
    {
        try {
            $todos = Todo::orderBy('position')->get();
            return response()->json([
                'success' => true,
                'message' => 'Todos retrieved successfully',
                'data' => $todos
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve todos'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255'
            ]);

            $maxPosition = Todo::max('position') ?? -1;
            $todo = Todo::create([
                'title' => $validated['title'],
                'is_completed' => false,
                'position' => $maxPosition + 1
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Todo created successfully',
                'data' => $todo
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create todo'
            ], 500);
        }
    }

    public function update(Request $request, Todo $todo)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'is_completed' => 'sometimes|boolean',
                'position' => 'sometimes|integer'
            ]);

            $todo->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Todo updated successfully',
                'data' => $todo
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update todo'
            ], 500);
        }
    }

    public function destroy(Todo $todo)
    {
        try {
            $todo->delete();

            return response()->json([
                'success' => true,
                'message' => 'Todo deleted successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete todo'
            ], 500);
        }
    }

    public function reorder(Request $request)
    {
        try {
            $validated = $request->validate([
                'orderData' => 'required|array',
            ]);
            $items = $request->orderData;
            foreach ($items as $item) {
                Todo::where('id', $item['id'])->update(['position' => $item['position']]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Todos reordered successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder todos ' . $e 
            ], 500);
        }
    }

    public function clearCompleted()
    {
        try {
            $deletedCount = Todo::where('is_completed', true)->delete();

            return response()->json([
                'success' => true,
                'message' => $deletedCount > 0 
                    ? "$deletedCount completed todo(s) deleted successfully"
                    : 'No completed todos found to delete'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear completed todos'
            ], 500);
        }
    }
}
